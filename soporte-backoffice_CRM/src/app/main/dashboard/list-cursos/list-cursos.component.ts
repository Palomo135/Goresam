import { CursoEdit } from '../etiquetera/cursoEdit';
import { CourseSharedService } from './../service/course-shared.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Curso } from '../etiquetera/curso';
import Swal from 'sweetalert2';
import { EtiqueteraService } from '../service/etiquetera.service';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EtiqueteraComponent } from '../etiquetera/etiquetera.component';
import { FormGroup } from '@angular/forms';
import { ModuloComponent } from 'app/main/modulo/R_modulo/modulo.component';
import { Modulo } from 'app/main/modulo/R_modulo/modulo';
import { Clausula } from 'app/main/clausula/r-clausula/clausula';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { CursoElistDTO } from '../etiquetera/cursosElist';
import { ModuloService } from 'app/main/modulo/modulo.service';
import { RClausulaComponent } from 'app/main/clausula/r-clausula/r-clausula.component';
import { ModuloList } from 'app/main/modulo/R_modulo/moduloList';
import { ClausulaService } from 'app/main/clausula/clausula.service';


@Component({
  selector: 'app-list-cursos',
  templateUrl: './list-cursos.component.html',
  styleUrls: ['./list-cursos.component.scss']
})
export class ListCursosComponent implements OnInit {
  cursoElist: CursoElistDTO[] = [];
  logoBaseUrl: 'http://localhost:3200/api/curso/logo/'
  cursos: Curso[] = [];
  clausula: Clausula[] = [];
  availableModules: any[] = [];
  availableClauses: any[] = [];
  availableModules: Modulo[] = [];
  availableClauses: Clausula[] = [];
  filteredRows: CursoElistDTO[] = [];
  searchTerm: string = '';
  basicSelectedOption: number = 10;
  verModal: boolean = false;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  courseForm: FormGroup;
  moduloList: ModuloList[] = [];
  clausulaList: any[] = [];
  selectedCursoId: number | null = null;
  selectedModuloId: number | null = null;
  selectedClausulas: number[] = [];
  modalRef: NgbModalRef | null = null;
  selectedCursoId: number | null = null;

  @Output() courseSaved = new EventEmitter<void>();
  @Output() editCurso: EventEmitter<Curso> = new EventEmitter<Curso>();
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild(EtiqueteraComponent) etiqueteraComponent: EtiqueteraComponent;
  @ViewChild(ModuloComponent) moduloComponent: ModuloComponent;
  @ViewChild('courseModal') courseModal: any;
  @ViewChild('clausulaModal') clausulaModal: any;

  searchTerm$: Subject<string> = new Subject<string>();

  constructor(
    private etiqueteraService: EtiqueteraService,
    private courseSharedService: CourseSharedService,
    private clausulaService: ClausulaService,
    private modalService: NgbModal,
    private moduloService: ModuloService
  ) { }

  ngOnInit(): void {
    this.loadCourses();
    this.loadAvailableModules();
    this.loadAvailableClauses();
  }

  loadCourses(): void {
    this.etiqueteraService.getCoursesElist().subscribe({
      next: (data) => {
        this.cursoElist = data;
        console.log(data);
        this.filteredRows = [...this.cursoElist];
      },
      error: (err) => console.error('Error al cargar los cursos:', err)
    });
  }
  // loadAvailableModules(): void {
  //   this.moduloService.getModulosSinCurso().subscribe(modules => {
  //     this.availableModules = modules;
  //   });
  // }

  loadAvailableModules(): void {
    this.moduloService.getModulosLista().subscribe({
      next: (modulos) => {
        this.availableModules = modulos.filter(modulo => !modulo.curso);
      }
    });
    (error) => {
      console.error('Error al cargar los módulos:', error);
    }
  }

  loadAvailableClauses(): void {
    this.clausulaService.getClausulas().subscribe({
      next: (clausulas) => {
        this.availableClauses = clausulas;
      },
      error: (err) => console.error('Error al cargar las cláusulas:', err)
    });
  }

  toggleModulePanel(row: CursoElistDTO): void {
    this.selectedCursoId = row.id;
    this.loadModulos(row.id);
  }

  openClausulaPanel(modulo: ModuloList): void {
    this.selectedModuloId = modulo.id;
    this.loadClausulas(modulo.id);

  toggleModulePanel(row: any) {
    this.selectedCursoId = row.id;
    this.loadModulos(row.id);
    
    const modalRef = this.modalService.open(this.courseModal, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.curso = row;
  }

  loadModulos(cursoId: number): void {
    this.moduloService.getModulosLista().subscribe({
      next: (modulos) => {
        console.log('Módulos cargados:', modulos);
        this.moduloList = modulos.filter(modulo => modulo.curso && modulo.curso.i= cursoId);
        console.log('Módulos filtrados:', this.moduloList);
        if (this.modalRef) {
          this.modalRef.close();
        }
        this.modalRef = this.modalService.open(this.courseModal, {
          size: 'lg',
          backdrop: 'static',
          keyboard: false
        })
        this.moduloList = modulos.filter(modulo => modulo.idCurso === cursoId);
        console.log('Módulos cargados:', this.moduloList);
      },
      error: (error) => {
        console.error('Error al cargar los módulos:', error);
      }

    })
  }

  // Método para cargar cláusulas disponibles
  loadClausulas(moduloId: number): void {
    this.clausulaService.getClausulasByModulo(moduloId).subscribe({
      next: (clausulas) => {
        console.log('Cláusulas cargadas:', clausulas);
        this.clausulaList = clausulas;
        console.log('Cláusulas filtradas:', this.clausulaList);
        // Cerrar cualquier modal abierto antes de abrir uno nuevo
        if (this.modalRef) {
          this.modalRef.close();
        }
        this.modalRef = this.modalService.open(this.clausulaModal, {
          size: 'lg',
          backdrop: 'static',
          keyboard: false
        })
      },
      error: (error) => {
        console.error('Error al cargar las cláusulas:', error);
      }
    });
  }

  assignModuloToCurso(): void {
    if (!this.selectedCursoId || !this.selectedModuloId) {
      Swal.fire('Error', 'Debe seleccionar un curso y un módulo.', 'error');
      return;
    }

    const assignModuleDto = {
      cursoId: this.selectedCursoId,
      moduloId: this.selectedModuloId
    };

    this.moduloService.assignModuleToCurso(assignModuleDto.cursoId, assignModuleDto.moduloId).subscribe({
      next: () => {
        Swal.fire('Asignado', 'El módulo ha sido asignado al curso.', 'success');
        this.loadAvailableModules(); // Recargar los módulos disponibles
        this.loadCourses();
        this.loadModulos(this.selectedCursoId);
      },
      error: (err) => {
        console.error('Error al asignar el módulo:', err);
        Swal.fire('Error', 'No se pudo asignar el módulo.', 'error');
      }
    });
  }

  assignClausulasToModulo(moduloId: number): void {
    this.clausulaService.assignClausulasToModulo(moduloId, this.selectedClausulas).subscribe({
      next: () => {
        console.log('Cláusulas asignadas exitosamente');
      },
      error: (err) => {
        console.error('Error al asignar las cláusulas:', err);
      }
    });
  }

  onEdit(id: number): void {
    this.etiqueteraService.getCursoById(id).subscribe({
      next: (fullCourse: Curso) => {
        this.courseSharedService.setCourse(fullCourse);
        const modalRef = this.modalService.open(EtiqueteraComponent, { size: 'lg' });
        modalRef.dismissed.subscribe(() => {
          this.loadCourses();
        });
      },
      error: (err) => console.error('Error al obtener el curso completo:', err),
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRows = this.cursoElist.filter((course) =>
      course.nombre.toLowerCase().includes(term)
    );
  }

  openCourseModal(): void {
    const modalRef = this.modalService.open(EtiqueteraComponent, { size: 'lg' });
    this.courseSharedService.clearCourse();
    modalRef.componentInstance.courseToEdit = null;
    modalRef.dismissed.subscribe(() => {
      this.filteredRows = [...this.cursoElist];
      this.loadCourses();
    });
  }

  openModuloModal(moduloId: number | null): void {
    const modalRef = this.modalService.open(ModuloComponent, { size: 'lg' });
    modalRef.componentInstance.cursoId = this.selectedCursoId;
    modalRef.componentInstance.moduloId = moduloId;
    modalRef.dismissed.subscribe(() => {
      if (this.selectedCursoId) {
        this.loadCourses();
  }

  openModuloModal(cursoId: number): void {
    const modalRef = this.modalService.open(ModuloComponent, { size: 'lg' });
    modalRef.componentInstance.cursoId = cursoId;
    modalRef.closed.subscribe(() => {
      if (this.selectedCursoId) {
        this.loadModulos(this.selectedCursoId);
      }
    });
    // this.loadCourses();
  }

  openClausulaModal(moduloId: number, clausula: Clausula | null = null): void {
    const modalRef = this.modalService.open(RClausulaComponent, { size: 'lg' });
    modalRef.componentInstance.moduloId = moduloId;
    modalRef.componentInstance.clausula = clausula;
    modalRef.closed.subscribe(() => {
      this.loadClausulas(this.selectedModuloId);
    });
  }

  // openClausulaModal(cursoId: number): void {
  //   const modalRef = this.modalService.open(RClausulaComponent, { size: 'lg' });
  //   modalRef.componentInstance.moduloId = cursoId;
  //   this.loadCourses();
  // }

  onDelete(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esto eliminará el curso de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.etiqueteraService.deleteCourse(id).subscribe({
          next: () => {
            this.cursos = this.cursos.filter((course) => course.id !== id);
            this.filteredRows = [...this.cursoElist];
            Swal.fire('Eliminado', 'El curso ha sido eliminado.', 'success');
            this.loadCourses();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el curso.', 'error'),
        });
      }
    });
  }

  onLogoError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/icons/unknown.png';
  }

  deleteModulo(moduloId: number): void {
    console.log('Eliminar módulo:', moduloId);
    this.moduloService.deleteModulo(moduloId).subscribe(() => {
      this.loadModulos(this.selectedCursoId);
      this.loadAvailableModules();
    });
  }

  deleteModuleFromCurso(cursoId: number, moduloId: number): void {
    this.moduloService.removeModuleFromCurso(cursoId, moduloId).subscribe({
      next: () => {
        Swal.fire('Eliminado', 'El módulo ha sido eliminado del curso.', 'success');
        // Actualiza la lista de módulos según sea necesario
        this.loadAvailableModules();
        this.loadModulos(cursoId);
      },
      error: (err) => {
        console.error(`Error al eliminar el módulo ${moduloId} del curso ${cursoId}:`, err);
        Swal.fire('Error', 'No se pudo eliminar el módulo del curso.', 'error');
      }
    });
  }

  deleteClausulaFromModulo(moduloId: number, clausulaId: number): void {
    console.log('Eliminar cláusula:', clausulaId);
    console.log('Módulo:', moduloId);
    this.clausulaService.removeClausulaFromModulo(moduloId, clausulaId).subscribe({
      next: () => {
        Swal.fire('Eliminado', 'La cláusula ha sido eliminada del módulo.', 'success');
        this.loadAvailableClauses();
        this.loadClausulas(moduloId);
      },
      error: (err) => {
        console.error('Error al eliminar la cláusula:', err);
        Swal.fire('Error', 'No se pudo eliminar la cláusula del módulo.', 'error');
      }
    });
  }
    imgElement.src = 'assets/placeholder.png';
  }
}