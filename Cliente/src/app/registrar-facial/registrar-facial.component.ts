import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { FormGroup,FormBuilder } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { LoaderService } from '../loader.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-registrar-facial',
  templateUrl: './registrar-facial.component.html',
  styleUrls: ['./registrar-facial.component.scss']
})
export class RegistrarFacialComponent implements AfterViewInit {

  constructor(private fb: FormBuilder, private http:HttpClient, public loaderService:LoaderService,private router:Router,private _snackBar : MatSnackBar) { }

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
      
    formData.append('groupPicture',this.canvas.nativeElement.toDataURL("image/png"));
    var currentUserId = sessionStorage.getItem('currentUser');   
  this.http.post(this.DIRECCION_SERVER+'/registrarRostro?codUser='+currentUserId,formData,{responseType: 'text'}).subscribe(
    (res)=>{
      this._snackBar.open("Rostro registrado con exito");
      this.router.navigate(['/','home']);
    },
    (err)=>{
      this._snackBar.open("Error con los mensajes");
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
