import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';
import { ActivatedRoute } from '@angular/router';
import Question from 'src/app/interfaces/question.interface';
import { async } from '@firebase/util';
import Answer from 'src/app/interfaces/answer.interface';


@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css']
})
export class AnswersComponent implements OnInit {
    @ViewChild('answerContent') answerContent!: ElementRef;
    @ViewChild('messageError') messageError!: ElementRef;
    questionsFromHome: Array<any> = []; // traemos las preguntas de home
    questionInfo: Object = {};
    question: Array<any> = [];
    newAnswer: any = {};
    questionId: string = '';
    answersByQuestion!: Answer[];
    sortedAnswers: Array<any> = [];

    constructor(
        private questionService: QuestionService,
        private activatedRoute: ActivatedRoute,
        private renderer: Renderer2
    ) {
        
        // Traemos los parámetros del url (id) para mostrar solo la info de la pregunta correspondiente al id
        this.activatedRoute.params.subscribe(paramsFromUrl => {
            this.questionInfo = this.questionService.getQuestion(paramsFromUrl['id']).subscribe((value) => { 
                this.questionId = paramsFromUrl['id'];
                 // Obtenemos las respuestas de la colección de firestore
                console.log(this.questionId, 'QUESTION ID');
                this.questionService.getAnswers(this.questionId).subscribe((value) => {
                    this.answersByQuestion = value;
                    this.sortByDateAndHour(value)
                })
                if (value.payload.exists === false) {
                    return null;
                } else {
                    const data = value.payload.data() as Question;
                    data.id = value.payload.id;
                    this.question.push(data);
                    return data
               }
                
            })
        });


    }

    ngOnInit(): void {}

    // Método para limpiar el campo de respuesta
    cleanAnswer() {
        if (
            this.answerContent.nativeElement.textContent ===
              'Da una respuesta detallada' ||
            this.answerContent.nativeElement.textContent ===
              'Tu respuesta no puede estar vacía'
          ) {
            this.answerContent.nativeElement.textContent = '';
          }
    }

    // Método para publicar la respuesta
    async postAnswer() {
        const today = new Date();
        const dateAndHour = today.toLocaleString();
        const dateSeparator = dateAndHour.split(' ');
        let contentAnswer = this.answerContent.nativeElement.textContent;

        if (contentAnswer === 'Da una respuesta detallada' || contentAnswer === '') {
            this.messageError.nativeElement.innerHTML = 'Tu respuesta no puede estar vacía';
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
                this.answerContent.nativeElement,
                'border',
                '2px solid #B01212'
              );
        } else {
            this.newAnswer = {
                questionId: this.questionId,
                content: contentAnswer,
                date: dateSeparator[0],
                hour: dateSeparator[1],
                createdAt: today.getTime(),
            }

            const response = await this.questionService.addAnswer(this.newAnswer);

            this.answerContent.nativeElement.textContent = 'Da una respuesta detallada'
            this.messageError.nativeElement.innerHTML = '';
            this.renderer.setStyle(
                this.messageError.nativeElement,
                'display',
                'none'
              );
              this.renderer.setStyle(
                this.answerContent.nativeElement,
                'border',
                '1px solid #b6b3b3'
              );
        }

    }

    // Método para ordenar las respuestas por fecha y hora de publicación
  sortByDateAndHour(answer: any) {
    this.sortedAnswers = this.answersByQuestion.sort(function (a, b) {
      if (a.createdAt > b.createdAt) {
        return -1;
      } else if (b.createdAt < a.createdAt) {
        return 1;
      }
      return 0;
    });
  }

}
