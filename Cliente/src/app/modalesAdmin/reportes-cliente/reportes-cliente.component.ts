import { Component, OnInit, Inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

type DatosReporte = { type : Number, usuario : any, currentId : number }

@Component({
  selector: 'app-reportes-cliente',
  templateUrl: './reportes-cliente.component.html',
  styleUrls: ['./reportes-cliente.component.scss']
})
export class ReportesClienteComponent implements OnInit {

  constructor(private http : HttpClient, @Inject(MAT_DIALOG_DATA) public data: DatosReporte) { }

  readonly SERVER_DIR :string = 'https://mean-server1.herokuapp.com';

  usuario : any;
  foto : string;
  grupo : boolean=true;
  reporte : any;

  radioContent  = [
    { titulo : 'Mensajes de odio', subtitulo : 'Racismo, sexismo, xenofobia, etc.' },
    {titulo : 'Abuso verbal', subtitulo : 'Acoso, lenguaje ofensivo'},
    { titulo : 'Perfil inapropiado', subtitulo : 'Lleva un nombre, descripción o foto inapropiadas' },
    {titulo : 'Actividad sospechosa', subtitulo : 'Usa la paltaforma con fines indebidos'}
  ]

  ngOnInit(): void {
    //type === 2 grupo
    //type === 1 usuario     
    
    if(this.data.type===2){
      this.grupo = false;
      this.usuario = this.data.usuario;
      this.foto = this.SERVER_DIR +'/'+ this.usuario.informacion.foto;
    }   
  }

  async buscarUsuario(idUsuario : string) :Promise<void> {
    await this.http.post(this.SERVER_DIR+`/usuarios/${idUsuario}`,{}).toPromise().then((usuario:any) =>{
      this.usuario = usuario;
    });    
    this.foto = this.SERVER_DIR+'/'+this.usuario.fotoPerfil;
  }
  generarReporte(){            
    
    if(this.reporte===''){
      return;
    }

    let reporte = {
      type : this.data.type === 1?1:2,
      id_reportado : this.usuario.id,
      reporte: this.reporte.titulo,
      id_reportador : parseInt(this.data.currentId.toString())
    };
        
    this.http.post(this.SERVER_DIR+`/generarReporte`,reporte).subscribe();
  }

}
