import { Component, OnInit, ElementRef, ViewChild, } from '@angular/core';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit  {
    // @ViewChild('searchBar') searchBar!: ElementRef;
    questionsFromHome: Array<any> = []; // traemos las preguntas de home
    searchedResults: Array<any> = [];
    allTitles: string = ''
    filteredTitles: boolean = false;
    questionsFromHeader: boolean = true;
    

    constructor(private questionService: QuestionService) {}

    ngOnInit(): void {
        this.questionService.$arrayOfQuestion.subscribe((value: any) => {
            this.questionsFromHome = value;
        });

        this.questionService.$sectionAllQuestions.subscribe((value: any) => {
            this.questionsFromHeader = value;
        })
    }


    // Método para guardar los valores de la barra de búsqueda 
    searchBar(event: any) {
        this.allTitles = event.target.value;
        // setTimeout(function () {
        //     filterTitles = event.target.value   
        // }, 1500)
    }
    
    // Método para mostrar los resultados de la barra de búsqueda
    searchTitlesQuestions(questions:any) {
        this.searchedResults = [];
        questions.filter((question: any) => {
            if (question.title.toLowerCase().includes(this.allTitles)) {
                this.searchedResults.push(question);
            }
            })
            this.filteredTitles = true;
            this.questionsFromHeader = false;
            this.questionService.$searchResults.emit(this.searchedResults);
            this.questionService.$filterTitles.emit(this.filteredTitles);
            this.questionService.$questionsFromHeader.emit(this.questionsFromHeader);
            
            return this.searchedResults;
    }    

}
