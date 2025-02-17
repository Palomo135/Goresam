import { CursoEdit } from '../etiquetera/cursoEdit';
import { CourseSharedService } from './../service/course-shared.service';
import { Component, ErrorHandler, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Curso } from '../etiquetera/curso';
import Swal from 'sweetalert2';
import { EtiqueteraService } from '../service/etiquetera.service';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EtiqueteraComponent } from '../etiquetera/etiquetera.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModuloComponent } from 'app/main/modulo/R_modulo/modulo.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { CursoElistDTO } from '../etiquetera/cursosElist';
import { ModuloService } from 'app/main/modulo/modulo.service';
import { ModuloList } from 'app/main/modulo/R_modulo/moduloList';
import * as moment from 'moment';


@Component({
  selector: 'app-list-cursos',
  templateUrl: './list-cursos.component.html',
  styleUrls: ['./list-cursos.component.scss']
})
export class ListCursosComponent implements OnInit {
  cursoElist: CursoElistDTO[] = [];
  logoBaseUrl: 'http://localhost:3200/api/curso/logo/'
  cursos: Curso[] = [];
  filteredRows: CursoElistDTO[] = [];
  searchTerm: string = '';
  basicSelectedOption: number = 10;
  loading: boolean = false;
  verModal: boolean = false;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  courseForm: FormGroup;
  moduloList: ModuloList[] = [];
  selectedCursoId: number | null = null;
  selectedModuloId: number | null = null;
  modalRef: NgbModalRef | null = null;
  duracionDias: Date;

  @Output() courseSaved = new EventEmitter<void>();
  @Output() editCurso: EventEmitter<Curso> = new EventEmitter<Curso>();
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild(EtiqueteraComponent) etiqueteraComponent: EtiqueteraComponent;
  @ViewChild(ModuloComponent) moduloComponent: ModuloComponent;
  @ViewChild('courseModal') courseModal: any;

  searchTerm$: Subject<string> = new Subject<string>();

  constructor(
    private errorHandlerService: ErrorHandler,
    private etiqueteraService: EtiqueteraService,
    private courseSharedService: CourseSharedService,
    private modalService: NgbModal,
    private moduloService: ModuloService,
  ) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.etiqueteraService.getCoursesElist().subscribe({
      next: (data) => {
        this.cursoElist = data;
        this.filteredRows = [...this.cursoElist];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar los cursos:', err);
        this.loading = false;
      }
    });
  }

  calcularDuracion(fechaInicio: string, fechaFin: string): number {
    const inicio = moment(fechaInicio);
    const fin = moment(fechaFin);
    return fin.diff(inicio, 'days');
  }


  getCursoEstado(curso: Curso): string {
    const today = new Date();
    const fechaInicio = new Date(curso.fechaInicio);
    const fechaCaducidad = new Date(curso.fechaCaducidad);

    if (today < fechaInicio) {
      return 'Proximo';
    } else if (today > fechaCaducidad) {
      return 'Caducado';
    } else {
      return 'Disponible';
    }
  }

  toggleModulePanel(row: CursoElistDTO): void {
    this.selectedCursoId = row.id;
    this.loadModulos(row.id);
  }

  loadModulos(cursoId: number): void {
    this.loading = true;
    this.moduloService.getModulosLista().subscribe({
      next: (modulos) => {
        console.log('Módulos cargados:', modulos);
        this.loading = false;
        this.moduloList = modulos.filter(modulo => modulo.curso && modulo.curso.id === cursoId);
        console.log('Módulos filtrados:', this.moduloList);
        if (this.modalRef) {
          this.modalRef.close();
        }
        this.modalRef = this.modalService.open(this.courseModal, {
          size: 'lg',
          backdrop: 'static',
          keyboard: false
        })
      },
      error: (error) => {
        console.error('Error al cargar los módulos:', error);
        this.loading = false;
      }
    })
  }

  onEdit(id: number): void {
    this.loading = true;
    this.etiqueteraService.getCursoById(id).subscribe({
      next: (fullCourse: Curso) => {
        this.loading = false;
        this.courseSharedService.setCourse(fullCourse);
        const modalRef = this.modalService.open(EtiqueteraComponent, { size: 'lg' });
        modalRef.dismissed.subscribe(() => {
          this.loadCourses();
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al obtener el curso completo:', err);
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRows = this.cursoElist.filter((course) =>
      course.nombre.toLowerCase().includes(term)
    );
  }

  openCourseModal(): void {
    try {
      this.loading = true;
      const modalRef = this.modalService.open(EtiqueteraComponent, { size: 'lg' });
      this.courseSharedService.clearCourse();
      modalRef.componentInstance.courseToEdit = null;
      this.loading = false;
      modalRef.dismissed.subscribe(() => {
        this.filteredRows = [...this.cursoElist];
        this.loadCourses();
      });
    } catch (error) {
      this.errorHandlerService.handleError(error);
    }
  }

  openModuloModal(moduloId: number | null): void {
    try {
      this.loading = true;
      const modalRef = this.modalService.open(ModuloComponent, { size: 'lg' });
      modalRef.componentInstance.cursoId = this.selectedCursoId;
      modalRef.componentInstance.moduloId = moduloId;
      this.loading = false;
      modalRef.dismissed.subscribe(() => {
        this.loadModulos(this.selectedCursoId);
      });
    } catch (error) {
      this.errorHandlerService.handleError(error);
    }
  }


  onDelete(id: number): void {
    try {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esto eliminará el curso de forma permanente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
      }).then((result) => {
        this.loading = true;
        if (result.isConfirmed) {
          this.etiqueteraService.deleteCourse(id).subscribe({
            next: () => {
              this.loading = false;
              this.cursos = this.cursos.filter((course) => course.id !== id);
              this.filteredRows = [...this.cursoElist];
              Swal.fire('Eliminado', 'El curso ha sido eliminado.', 'success');
              this.loadCourses();
            },
            error: () => {
              this.loading = false;
              Swal.fire('Error', 'No se pudo eliminar el curso.', 'error');
            },
          });
        }
      });
    } catch (error) {
      this.errorHandlerService.handleError(error);
    }
  }

  onLogoError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/icons/unknown.png';
  }

  deleteModulo(moduloId: number): void {
    try {
      this.loading = true;
      console.log('Eliminar módulo:', moduloId);
      this.loading = false;
      this.moduloService.deleteModulo(moduloId).subscribe(() => {
        Swal.fire('Eliminado', 'El modulo ha sido eliminado.', 'success');
        this.loadModulos(this.selectedCursoId);
      },
        () => {
          Swal.fire('Error', 'El modulo ha sido eliminado.', 'error');
        }
      );
    }
    catch (error) {
      this.errorHandlerService.handleError(error);
    }
  }

}