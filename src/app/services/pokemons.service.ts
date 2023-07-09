import {HttpClient, HttpHeaders} from '@angular/common/http';
import {forkJoin, map, Observable, switchMap, TimeoutError} from 'rxjs';
import {catchError, timeout} from 'rxjs/operators';
import {Inject, Injectable} from "@angular/core";

const TIMEOUT_MS = 60000; // front-end time-out for API calls
const TIMEOUT_ERROR = class implements Error {
  message!: string;
  name!: string;
  stack!: string;
  error: any = {
    message: 'A service failed to respond in time.'
  };
};

interface PokemonResponse {
  results: Array<{
    name: string;
    url: string;
  }>;
}

interface PokemonDetails {
  sprites: {
    front_default: string;
  };
}


export class PokemonService {
  public baseUrl = 'https://pokeapi.co/api/v2';


  private httpClient: HttpClient;
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  });

  //
  // constructors
  //

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  //
  // error handler
  //

  private static handleError(e: any): any {
    if (e instanceof TimeoutError) {
      throw TIMEOUT_ERROR;
    }

    throw e;
  }

  //
  // APIs
  //

  getPokemon() {
    return this.httpClient.get<PokemonResponse>(`${this.baseUrl}/pokemon?limit=100`).pipe(
      switchMap(data => {
        const requests = data.results.map(pokemon => this.httpClient.get<PokemonDetails>(pokemon.url));
        return forkJoin(requests).pipe(
          map(pokemonDetails => pokemonDetails.map((details, index) => ({
            ...data.results[index],
            sprites: details.sprites
          })))
        );
      })
    );
  }

  //
  // calls
  //

  protected get(uri: string): Observable<any> {
    return this.httpClient.get(uri, {
      headers: this.headers
    }).pipe(
      timeout(TIMEOUT_MS),
      catchError((e: any) => {
        return PokemonService.handleError(e);
      })
    );
  }

  protected post(uri: string, body: any): Observable<any> {
    return this.httpClient.post(uri, body, {
      headers: this.headers
    }).pipe(
      timeout(TIMEOUT_MS),
      catchError((e: any) => {
        return PokemonService.handleError(e);
      })
    );
  }

  protected postMultipart(uri: string, formData: FormData): Observable<any> {
    return this.httpClient.post(uri, formData).pipe(
      timeout(TIMEOUT_MS),
      catchError((e: any) => {
        return PokemonService.handleError(e);
      })
    );
  }

  protected put(uri: string, body: any): Observable<any> {
    return this.httpClient.put(uri, body, {
      headers: this.headers
    }).pipe(
      timeout(TIMEOUT_MS),
      catchError((e: any) => {
        return PokemonService.handleError(e);
      })
    );
  }

  protected delete(uri: string): Observable<any> {
    return this.httpClient.delete(uri, {
      headers: this.headers
    }).pipe(
      timeout(TIMEOUT_MS),
      catchError((e: any) => {
        return PokemonService.handleError(e);
      })
    );
  }
}
