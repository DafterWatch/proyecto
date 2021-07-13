import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { FormGroup,FormBuilder } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { LoaderService } from '../loader.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reconocimiento-facial',
  templateUrl: './reconocimiento-facial.component.html',
  styleUrls: ['./reconocimiento-facial.component.scss']
})
export class ReconocimientoFacialComponent implements AfterViewInit {

  constructor(private fb: FormBuilder, private http:HttpClient, public loaderService:LoaderService,private router:Router) { }

  ngOnInit(): void {
  }
  WIDTH = 1100;
  HEIGHT = 650;

  @ViewChild("video")
  public video: ElementRef;

  @ViewChild("canvas")
  public canvas: ElementRef;

  captures: string[] = [];
  error: any;
  isCaptured: boolean;

  async ngAfterViewInit() {
    await this.setupDevices();
  }

  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = "You have no output video device";
        }
      } catch (e) {
        this.error = e;
      }
    }
  }
  readonly DIRECCION_SERVER :string = 'https://mean-server1.herokuapp.com';

  async capture() {
    this.drawImageToCanvas(this.video.nativeElement);
    this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
    this.isCaptured = true;

    const formData : FormData = new FormData;   
      
    formData.append('groupPicture123',this.canvas.nativeElement.toDataURL("image/png"));
 
  this.http.post(this.DIRECCION_SERVER+'/compararImagenes?codLog=2',formData,{responseType: 'text'}).subscribe(
    (res)=>{
      var responseObject=JSON.parse(res);
      var distance=parseFloat(responseObject._distance);
      var label=parseFloat(responseObject._label);
      var labelParsed=label.toString().split(".");
      var parsed2=labelParsed[0].split("\"");

  console.log(distance);
      if(distance<0.40){
        this.http.post(this.DIRECCION_SERVER+`/usuarios/${parsed2}`,{responseType: 'text'}).toPromise().then(usuario_ =>{  

          var usuario:any=usuario_;    
          var answer = window.confirm("¿Usuario encontrado desea continuar?");
          if (answer) {
            sessionStorage.setItem('currentUser',usuario.id);  
            let userDataSave = JSON.stringify(usuario);
            sessionStorage.setItem('currentUserData',userDataSave);  
            this.router.navigate(['/','home']);
          }
          else {
          
          } 
        
        });
      }
      else {
        alert("Rostro no identificado");
      }
      
    },
    (err)=>{
      alert("Rostro no identificado");
      console.log(err)
    }
    );
    
  }

  removeCurrent() {
    this.isCaptured = false;
  }

  setPhoto(idx: number) {
    this.isCaptured = true;
    var image = new Image();
    image.src = this.captures[idx];
    this.drawImageToCanvas(image);
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }
}
