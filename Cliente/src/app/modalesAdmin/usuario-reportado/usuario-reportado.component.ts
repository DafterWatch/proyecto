import { Component, OnInit,Inject } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-usuario-reportado',
  templateUrl: './usuario-reportado.component.html',
  styleUrls: ['./usuario-reportado.component.scss'],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class UsuarioReportadoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UsuarioReportadoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) { 
    
  }

  DIRECCION_SERVER : string = 'http://localhost:3000';

  listaMensajes : Array< {} >;
  usuario : any; 
  reporte : string;
  fotoPerfil : string = '';
  idReportador : number;
  type : number;
  lista : string;

  ngOnInit(): void {
    this.type = this.data.informacionReporte.type; 
    let id_reportado = this.data.informacionReporte.id_reportado;
    this.idReportador = this.data.informacionReporte.id_reportador;
    this.reporte = this.data.informacionReporte.reporte;   
    
    if(this.type === 1){    
      this.buscarInformacionUsuario(id_reportado);
      this.lista = 'reporteUsuario';
    }
    else{
      this.buscarInformacionGrupo(id_reportado);
      this.lista = 'reporteGrupo';
    }
  }  
  async buscarInformacionUsuario(id_reportado:number) : Promise<void> {
    await this.http.post(this.DIRECCION_SERVER+`/usuarios/${id_reportado}`,{}).toPromise().then(usuario_ =>{
      this.usuario = usuario_;
      this.fotoPerfil = this.DIRECCION_SERVER+'/'+this.usuario.fotoPerfil;
    });
    await this.http.post(this.DIRECCION_SERVER+'/mostrarMensajes/'+id_reportado,{}).toPromise().then((mensajes:any)=>{            
      
      this.listaMensajes = mensajes.map(x=>({mensaje:x.message, fecha: new Date(x.time) }));
      
    });
  }

  async buscarInformacionGrupo(id_reportado:number) : Promise<void>{
    await this.http.post(this.DIRECCION_SERVER+`/obtenerGrupo/${id_reportado}`,{}).toPromise().then((grupo:any) =>{            
      this.usuario = grupo[0];
      this.fotoPerfil = this.DIRECCION_SERVER+'/'+this.usuario.informacion.foto;
    });    
    this.listaMensajes = this.usuario.mensajes.filter(x=> x.type === 1 );
    this.listaMensajes = this.listaMensajes.map((x:any)=> ({mensaje:x.message, fecha: new Date(x.time),sender :x.name }))
  }

  validarFecha( fecha : Date ) : string {
    if(fecha.toDateString() === new Date(Date.now()).toDateString() ){
      return fecha.getHours() + ":" + fecha.getMinutes();
    }
    return fecha.getDay()+'/'+fecha.getMonth()+'/'+fecha.getFullYear();
  }

  
  async descartarReporte(){    
    await this.http.post(this.DIRECCION_SERVER+`/borrarReporte/${this.usuario.id}`,{}).subscribe();   
  }

  async bloquearUsuario(){

    let data = {
      idUsuario : this.usuario.id,
      type : this.type === 1? 3 : 4,
      grupo : this.type === 1?false:true
    }

    await this.http.post(this.DIRECCION_SERVER+'/bloquearUsuario',data).subscribe();
  }
  
  closeModal(){
    this.dialogRef.close();
  }

}
