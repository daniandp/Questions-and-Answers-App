import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from 'src/app/services/question.service';
import Question from 'src/app/interfaces/question.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    @ViewChild('questionTitle') questionTitle!: ElementRef;
    @ViewChild('questionContent') questionContent!: ElementRef;
    @ViewChild('messageError') messageError!: ElementRef;
    newQuestion: any = {};
    postedQuestions!: Question[];
    sortedQuestions: Array<any> = [];

    

  ngOnInit(): void {
    this.questionService.getQuestions().subscribe((question) => {
        this.postedQuestions = question; 
        this.sortByHour(question);
    });
  }

  constructor(
    private questionService: QuestionService,
    private renderer: Renderer2
  ) {}

  // Método para limpiar campo del título
  cleanTitle() {
    if (
      this.questionTitle.nativeElement.textContent ===
        'Ejm: ¿Cómo se utiliza el método filter?' ||
      this.questionTitle.nativeElement.textContent ===
        'Tu pregunta debe tener un título'
    ) {
      this.questionTitle.nativeElement.textContent = '';
    }
      
  }

  // Método para limpiar campo del contenido
  cleanContent() {
    if (
      this.questionContent.nativeElement.textContent ===
        'Ejm: estoy intentando filtrar un elemento de un array' ||
      this.questionContent.nativeElement.textContent ===
        'Tu pregunta debe tener detalles'
    ) {
      this.questionContent.nativeElement.textContent = '';
    }
  }

  // Método para publicar la pregunta
  async postQuestion() {
    const today = new Date();
    const dateAndHour = today.toLocaleString();
    const dateSeparator = dateAndHour.split(' ');
    let title = this.questionTitle.nativeElement.textContent;
    let detail = this.questionContent.nativeElement.textContent;
    if (
      (title === 'Ejm: ¿Cómo se utiliza el método filter?' || title === '') &&
      (detail === 'Ejm: estoy intentando filtrar un elemento de un array' ||
        detail === '')
    ) {
      this.messageError.nativeElement.innerHTML =
        'Debes llenar todos los campos';
      this.renderer.setStyle(
        this.messageError.nativeElement,
        'display',
        'block'
      );
      this.renderer.setStyle(
        this.messageError.nativeElement,
        'background-color',
        '#B01212'
      );
      this.renderer.setStyle(
        this.questionTitle.nativeElement,
        'border',
        '2px solid #B01212'
      );
      this.renderer.setStyle(
        this.questionContent.nativeElement,
        'border',
        '2px solid #B01212'
      );
    } else if (
      title === 'Ejm: ¿Cómo se utiliza el métodol filter?' ||
      title === ''
    ) {
      this.messageError.nativeElement.innerHTML =
        'Tu pregunta debe tener un título';
      this.renderer.setStyle(
        this.messageError.nativeElement,
        'display',
        'block'
      );
      this.renderer.setStyle(
        this.messageError.nativeElement,
        'background-color',
        '#B01212'
      );
      this.renderer.setStyle(
        this.questionTitle.nativeElement,
        'border',
        '2px solid #B01212'
      );
    } else if (
      detail === 'Ejm: estoy intentando filtrar un elemento de un array' ||
      detail === ''
    ) {
      this.messageError.nativeElement.innerHTML =
        'Tu pregunta debe tener detalles';
      this.renderer.setStyle(
        this.messageError.nativeElement,
        'display',
        'block'
      );
      this.renderer.setStyle(
        this.messageError.nativeElement,
        'background-color',
        '#B01212'
      );
      this.renderer.setStyle(
        this.questionContent.nativeElement,
        'border',
        '2px solid #B01212'
      );
    } else {
      this.newQuestion = {
        title,
        detail,
        date: dateSeparator[0],
        hour: dateSeparator[1],
        createdAt: today.getTime(),
      };
      const response = await this.questionService.addQuestion(this.newQuestion);
      this.questionTitle.nativeElement.textContent =
        'Ejm: ¿Cómo se utiliza el método filter?';
      this.questionContent.nativeElement.textContent =
        'Ejm: estoy intentando filtrar un elemento de un array';
      this.messageError.nativeElement.innerHTML = '';
      this.renderer.setStyle(
        this.messageError.nativeElement,
        'display',
        'none'
      );
      this.renderer.setStyle(
        this.questionTitle.nativeElement,
        'border',
        '1px solid #b6b3b3'
      );
      this.renderer.setStyle(
        this.questionContent.nativeElement,
        'border',
        '1px solid #b6b3b3'
      );
    }
  }

    // Método para ordenar por fecha y hora de publicación
    sortByHour(question: any) {
        this.sortedQuestions = this.postedQuestions.sort(function (a, b) {
            if (a.createdAt > b.createdAt) {
                return -1;

            } else if (b.createdAt < a.createdAt) {
                return 1
            }

            return 0
        })
    }

    

}
