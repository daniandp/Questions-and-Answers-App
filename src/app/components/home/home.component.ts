import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    @ViewChild('questionTitle') questionTitle!: ElementRef
    @ViewChild('questionContent') questionContent!: ElementRef
    sendQuestion: any = {};

    ngOnInit(): void {
    }

    constructor(private questionService: QuestionService) { }
    
    // Método para limpiar campo del título
    cleanTitle() {
        if (this.questionTitle.nativeElement.textContent === 'Ejm: ¿Cómo se utiliza el métodol filter?') {
            this.questionTitle.nativeElement.textContent = '';
        }
    }

    // Método para limpiar campo del contenido
    cleanContent() {
        if (this.questionContent.nativeElement.textContent === 'Ejm: estoy intentando filtrar un elemento de un array') {
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
        if (title !== '' && detail !== '' && title !== 'Ejm: ¿Cómo se utiliza el métodol filter?' && detail !== 'Ejm: estoy intentando filtrar un elemento de un array' ) {
            this.sendQuestion = {
                title,
                detail,
                date: dateSeparator[0],
                hour: dateSeparator[1]
            }
            title = 'Ejm: ¿Cómo se utiliza el métodol filter?';
            detail = 'Ejm: estoy intentando filtrar un elemento de un array';

            const response = await this.questionService.addQuestion(this.sendQuestion);

        } else {
            title = 'Tu pregunta debe tener un título';
        }

        
    }

}
