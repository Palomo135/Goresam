import { CursoEdit } from '../etiquetera/cursoEdit';
import { CourseSharedService } from './../service/course-shared.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Curso } from '../etiquetera/curso';
import Swal from 'sweetalert2';
import { EtiqueteraService } from '../service/etiquetera.service';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
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

@Component({
  selector: 'app-list-cursos',
  templateUrl: './list-cursos.component.html',
  styleUrls: ['./list-cursos.component.scss']
})
export class ListCursosComponent implements OnInit {
  cursoElist: CursoElistDTO[] = [];
  logoBaseUrl: 'http://localhost:3200/api/curso/logo/'
  cursos: Curso[] = [];
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
  selectedCursoId: number | null = null;

  @Output() courseSaved = new EventEmitter<void>();
  @Output() editCurso: EventEmitter<Curso> = new EventEmitter<Curso>();
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild(EtiqueteraComponent) etiqueteraComponent: EtiqueteraComponent;
  @ViewChild(ModuloComponent) moduloComponent: ModuloComponent;
  @ViewChild('courseModal') courseModal: any;

  searchTerm$: Subject<string> = new Subject<string>();

  constructor(
    private etiqueteraService: EtiqueteraService,
    private courseSharedService: CourseSharedService,
    private modalService: NgbModal,
    private moduloService: ModuloService
  ) { }

  ngOnInit(): void {
    this.loadCourses();
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

  toggleModulePanel(row: CursoElistDTO): void {
    console.log('Curso seleccionado:', row);
    this.selectedCursoId = row.id;
    this.loadModulos(row.id);
  }

  loadModulos(cursoId: number): void {
    this.moduloService.getModulosLista().subscribe({
      next: (modulos) => {
        console.log('Módulos cargados:', modulos);
        this.moduloList = modulos.filter(modulo => modulo.Curso.id === cursoId);
        console.log('Módulos cargados:', this.moduloList);
        this.modalService.open(this.courseModal, {
          size: 'lg',
          backdrop: 'static',
          keyboard: false
        });
      },
      error: (error) => {
        console.error('Error al cargar los módulos:', error);
      }
    });
  }

  onEdit(id: number): void {
    this.etiqueteraService.getCursoById(id).subscribe({
      next: (fullCourse: Curso) => {
        this.courseSharedService.setCourse(fullCourse);
        const modalRef = this.modalService.open(EtiqueteraComponent, { size: 'lg' });
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
  }

  openModuloModal(cursoId: number): void {
    const modalRef = this.modalService.open(ModuloComponent, { size: 'lg' });
    modalRef.componentInstance.cursoId = cursoId;
    modalRef.closed.subscribe(() => {
      if (this.selectedCursoId) {
        this.loadModulos(this.selectedCursoId);
      }
    });
  }

  openClausulaModal(cursoId: number): void {
    const modalRef = this.modalService.open(RClausulaComponent, { size: 'lg' });
    modalRef.componentInstance.moduloId = cursoId;
  }

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
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el curso.', 'error'),
        });
      }
    });
  }

  onLogoError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/placeholder.png';
  }

}