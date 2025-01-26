import { ClausulaService } from './../clausula.service';
import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Clausula } from '../r-clausula/clausula';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RClausulaComponent } from '../r-clausula/r-clausula.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-clausula',
  templateUrl: './listar-clausula.component.html',
  styleUrls: ['./listar-clausula.component.scss']
})
export class ListarClausulaComponent implements OnInit, AfterViewInit {

  clausulas: Clausula[] = [];

  constructor(
    private clausulaService: ClausulaService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) { }

  // ngOnInit(): void {
  //   this.clausulaService.getClausulas().subscribe((clausulas)=>{
  //     this.clausulas = clausulas;
  //   })
  // }

  ngOnInit(): void {
    //this.loadClasulas();
    this.getClausulas();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  getClausulas(): void {
    this.clausulaService.getClausulas().subscribe((clausulas) => {
      this.clausulas = clausulas;
    })
  }

  openEditClausulaModal(clausula: Clausula): void {
    const modalRef = this.modalService.open(RClausulaComponent, { size: 'lg' });
    modalRef.componentInstance.clausula = clausula; // Pasamos la cláusula al componente de registro
    modalRef.result.then(() => {
      this.getClausulas(); // Recargar la lista después de editar
    }).catch(() => { });
  }

  deleteClausula(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clausulaService.deleteClausula(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La cláusula ha sido eliminada.', 'success');
            this.getClausulas(); // Recargar la lista después de eliminar
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar la cláusula.', 'error')
        });
      }
    });
  }
}
