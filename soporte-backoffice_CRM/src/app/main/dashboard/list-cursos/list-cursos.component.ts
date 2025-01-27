import { CursoEdit } from '../etiquetera/cursoEdit';
import { CourseSharedService } from './../service/course-shared.service';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Curso } from '../etiquetera/curso';
import Swal from 'sweetalert2';
import { EtiqueteraService } from '../service/etiquetera.service';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // Asegúrate de importar NgbModal
import { EtiqueteraComponent } from '../etiquetera/etiquetera.component';
import { FormGroup } from '@angular/forms';
import { ModuloComponent } from 'app/main/modulo/R_modulo/modulo.component';
import { Modulo } from 'app/main/modulo/R_modulo/modulo';
import { Clausula } from 'app/main/clausula/r-clausula/clausula';
import { Subject } from 'rxjs';
import { CursoElistDTO } from '../etiquetera/cursosElist';
import { ModuloService } from 'app/main/modulo/modulo.service';
import { RClausulaComponent } from 'app/main/clausula/r-clausula/r-clausula.component';


@Component({
  selector: 'app-list-cursos',
  templateUrl: './list-cursos.component.html',
  styleUrls: ['./list-cursos.component.scss']
})
export class ListCursosComponent implements OnInit {
  @ViewChild('table') table: any;
  cursoElist: CursoElistDTO[] = [];
  cursos: Curso[] = [];
  modulos: Modulo[] = [];
  availableClauses: Clausula[] = [];
  //filteredRows: Curso[] = [];
  filteredRows: CursoElistDTO[] = [];
  selectedModule: { [key: number]: number } = {};
  expanded: { [key: number]: boolean } = {};
  searchTerm: string = '';
  basicSelectedOption: number = 10;
  verModal: boolean = true;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  courseForm: FormGroup;

  @Output() courseSaved = new EventEmitter<void>(); // Evento para notificar que un curso se guardó
  @Output() editCurso: EventEmitter<Curso> = new EventEmitter<Curso>();
  //@Output() editCourse = new EventEmitter<Curso>();
  // @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild(EtiqueteraComponent) etiqueteraComponent: EtiqueteraComponent; // Referencia al componente de creación/edición de curso
  @ViewChild(ModuloComponent) moduloComponent: ModuloComponent; // Referencia al componente de creación/edición de curso

  searchTerm$: Subject<string> = new Subject<string>();


  constructor(
    private etiqueteraService: EtiqueteraService,
    private courseSharedService: CourseSharedService,
    private moduloService: ModuloService,

    private modalService: NgbModal // Inyectar el servicio NgbModal
  ) { }

  ngOnInit(): void {
    this.loadCourses();
    this.loadModulos();
  }

  loadCourses(): void {
    this.etiqueteraService.getCoursesElist().subscribe({
      next: (data) => {
        this.cursoElist = data;
        console.log(data);
        //this.loadCourses();
        this.filteredRows = [...this.cursoElist]; // Inicializar filas filtradas
        this.verModal = false;
      },
      error: (err) => console.error('Error al cargar los cursos:', err)
    });
  }

  loadModulos(): void {
    this.moduloService.getTodosModulos().subscribe({
      next: (data) => {
        this.modulos = data;
        console.log(data);
      },
      error: (err) => console.error('Error al cargar los módulos:', err)
    });
  }

  assignModule(cursoId: number): void {
    const moduloId = this.selectedModule[cursoId];
    this.moduloService.assignModuleToCurso(cursoId, moduloId).subscribe({
      next: () => {
        Swal.fire('Módulo asignado', 'El módulo ha sido asignado al curso.', 'success');
        this.loadCourses();
      },
      error: () => Swal.fire('Error', 'No se pudo asignar el módulo.', 'error')
    });
  }

  removeModule(cursoId: number, moduloId: number): void {
    this.moduloService.removeModuleFromCurso(cursoId, moduloId).subscribe({
      next: () => {
        Swal.fire('Módulo eliminado', 'El módulo ha sido eliminado del curso.', 'success');
        this.loadCourses();
      },
      error: () => Swal.fire('Error', 'No se pudo eliminar el módulo.', 'error')
    });
  }

  toggleExpandRow(row: any): void {
    this.expanded[row.id] = !this.expanded[row.id];
    //this.table.rowDetail.toggleExpandRow(row);
  }


  onEdit(id: number): void {
    this.etiqueteraService.getCursoById(id).subscribe({
      next: (fullCourse: Curso) => {

        this.courseSharedService.setCourse(fullCourse); // Enviar al servicio

        // Abrimos el modal
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

  // Función para abrir el modal
  openCourseModal(): void {

    const modalRef = this.modalService.open(EtiqueteraComponent, { size: 'lg' });
    // Escuchar el evento `courseSaved`
    this.courseSharedService.clearCourse();
    modalRef.componentInstance.courseToEdit = null; // No se pasa ningún curso, así que se crea uno nuevo

  }


  openModuloModal(cursoId: number): void {
    const modalRef = this.modalService.open(ModuloComponent, { size: 'lg' });
    modalRef.componentInstance.cursoId = cursoId; // Pasar el ID del curso al modal
    modalRef.closed.subscribe(() => {
      // Llama a un método en ListCursosComponent si necesitas refrescar algo aquí
      console.log('Modal cerrado');
    });
    // modalRef.result.then(
    //   (result) => {
    //     this.selectedModule[cursoId] = result.id; // Asigna el nuevo módulo al curso
    //     this.assignModule(cursoId);
    //   }, 
    // (reason) => {}
    // );
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
            this.filteredRows = [...this.cursoElist]; // Actualizar las filas filtradas
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
    imgElement.src = 'assets/placeholder.png'; // Ruta al placeholder
  }

}
