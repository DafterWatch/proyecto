import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-buscar-usuario',
  templateUrl: './buscar-usuario.component.html',
  styleUrls: ['./buscar-usuario.component.scss']
})
export class BuscarUsuarioComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BuscarUsuarioComponent>,private http: HttpClient) { }

  usuario : any ;
  foto : string
  DIRECCION_SERVER : string = 'http://localhost:3000';
  ngOnInit(): void {
  }
  async buscarUsuario(idUsuario : string) : Promise<void>{
    await this.http.post(this.DIRECCION_SERVER+`/usuarios/${idUsuario}`,{}).toPromise().then(usuario_ =>{        
      this.usuario = usuario_;                
      this.foto = this.DIRECCION_SERVER + '/' +this.usuario.fotoPerfil;
    });
  }
  closeModal(){
    this.dialogRef.close();
  }

  async bloquearUsuario(){
    if(this.usuario){      
       await this.http.post(this.DIRECCION_SERVER+'/bloquearUsuarioDirecto',{idUsuario: this.usuario.id}).toPromise().then((data:any) =>{
         if(data.error){
           console.log(data.mensaje);
         }
       });
    }
  }
}
