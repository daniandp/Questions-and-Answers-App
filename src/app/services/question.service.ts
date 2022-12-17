import { Injectable, EventEmitter } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import Question from '../interfaces/question.interface';
import Answer from '../interfaces/answer.interface';
import { AngularFirestore} from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {

    constructor(private firestore: Firestore, private afs: AngularFirestore) { }


    // Creamos la coleccion de las preguntas
    addQuestion(question: Question) {
        const docRef = collection(this.firestore, 'questions');
        return addDoc(docRef, question);
    }

    // Obtenemos todas las preguntas
    getQuestions():Observable<Question[]>  {
        const docRef = collection(this.firestore, 'questions');
        return collectionData(docRef, {idField: 'id'}) as Observable<Question[]>;
    }

    // Obtenemos una pregunta
    getQuestion(questionId: string)  {
        return this.afs.collection('questions').doc(questionId).snapshotChanges();
    }

    // Creamos la colección de las respuestas
    addAnswer(answer: Answer) {
        const docRef = collection(this.firestore, 'answers');
        return addDoc(docRef, answer);
    }

    // Obtenemos las respuestas solo de la pregunta seleccionada por el usuario
    getAnswers(questionId: string)  {
        const docRef = this.afs.collection('answers', (ref) =>
            ref.where('questionId', '==', questionId)
        );
        return docRef.valueChanges({ idField: 'id' }) as Observable<Answer[]>;
    }

    // Observables
    $arrayOfQuestion = new EventEmitter<any>();
    $searchResults = new EventEmitter<any>();
    $filterTitles = new EventEmitter<any>();
    $sectionAllQuestions = new EventEmitter<any>();
    $questionsFromHeader = new EventEmitter<any>();

}
