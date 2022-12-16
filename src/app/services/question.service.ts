import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import Question from '../interfaces/question.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

    constructor(private firestore: Firestore) { }
    
    addQuestion(question: Question) {
        const placeRef = collection(this.firestore, 'questions');
        return addDoc(placeRef, question);

    }



}
