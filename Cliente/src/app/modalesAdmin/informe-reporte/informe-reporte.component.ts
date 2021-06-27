import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-informe-reporte',
  templateUrl: './informe-reporte.component.html',
  styleUrls: ['./informe-reporte.component.scss']
})
export class InformeReporteComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<InformeReporteComponent>,@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) { }

  type : number;
  bloqueado : any;
  reporte : string;
  lista : string;

  DIRECCION_SERVER : string = 'http://localhost:3000';

  ngOnInit(): void {
    this.type = this.data.informacionBloqueo.type;
    this.reporte = this.data.informacionBloqueo.reporte;    
    
    this.getBloqueado(this.data.informacionBloqueo.id_bloqueado);
  }

  async getBloqueado(idBloqueo : number){    
    
    if(this.type === 3){      
      await this.http.post(this.DIRECCION_SERVER+`/usuarios/${idBloqueo}`,{}).toPromise().then(usuario_ =>{        
        this.bloqueado = usuario_;                
      });
      this.lista = 'usuariosBloqueados';
    }else if(this.type === 4){
      await this.http.post(this.DIRECCION_SERVER+`/obtenerGrupo/${idBloqueo}`,{}).toPromise().then(grupo_ =>{
        this.bloqueado = grupo_[0];                
      });
      this.lista = 'gruposBloqueados';
    }
  }

  closeModal() : void{
    this.dialogRef.close();
  }

  desBloquear(){          
    this.http.post(this.DIRECCION_SERVER+`/desbloquear/${this.bloqueado.id}`,{}).subscribe();
  }

}
