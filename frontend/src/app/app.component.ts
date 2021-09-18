import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const GET_QUOTES = gql`
{
  quotes {
    quotes{
      _id
      quote
      author
    }
  }
}
`;

const CREATE_QUOTE = gql`
  mutation createQuote($quote:String!, $author:String!){
    createQuote(quoteInput:{quote: $quote, author: $author}){
      quote
      author
      _id
    }
  }
`;

const UPDATE_QUOTE = gql`
  mutation updateQuote($Id:ID!,$quote:String!, $author:String!){
    updateQuote(id:$Id,quoteInput:{quote: $quote, author: $author}){
      quote
      author
      _id
    }
  }
`;

const DELETE_QUOTE = gql`
  mutation deleteQuote($Id:ID!){
    deleteQuote(id:$Id){
      quote
      author
      _id
    }
  }
`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  quotes: Observable<any>;
  flag: boolean;
  Id: String;

  @ViewChild("quote", { static: true }) inputQuote: ElementRef;
  @ViewChild("author", { static: true }) inputAuthor: ElementRef;


  constructor(private apollo: Apollo) {
    this.flag = false

  }

  ngOnInit() {
    this.quotes = this.apollo.watchQuery({
      query: GET_QUOTES
    }).valueChanges.pipe(map((result: any) => {
      console.log(result.data.quotes.quotes)
      return result.data.quotes.quotes
    }))
    // console.log(this.quotes)
  }

  create(Id: String = '', quote: string, author: string) {
    if (this.flag) {
      this.updateSubmit(false, this.Id, quote, author);
    } else {
      this.updateSubmit(true, Id, quote, author);
    }
  }

  update(Id: String, quote: string, author: string) {
    console.log(quote, author)
    this.inputQuote.nativeElement.value = quote
    this.inputAuthor.nativeElement.value = author
    this.flag = true
    this.Id = Id;
  }

  delete(Id: String) {
    this.flag = false;
    this.apollo.mutate({
      mutation: DELETE_QUOTE,
      refetchQueries: [{ query: GET_QUOTES }],
      variables: {
        Id: Id
      }
    }).subscribe((x) => {
      console.log("Deleted")
    })
  }

  updateSubmit(nativeEl, Id, quote, author) {
    this.flag = false;
    if (nativeEl) {
      this.apollo.mutate({
        mutation: CREATE_QUOTE,
        refetchQueries: [{ query: GET_QUOTES }],
        variables: {
          quote: quote,
          author: author
        }
      }).subscribe((x) => {
        console.log("Created")
      })
    } else {
      this.apollo.mutate({
        mutation: UPDATE_QUOTE,
        refetchQueries: [{ query: GET_QUOTES }],
        variables: {
          Id: Id,
          quote: quote,
          author: author
        }
      }).subscribe((x) => {
        console.log("Updated")
      })
    }

  }
}
