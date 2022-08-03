import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/interfaces/game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-search',
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.scss']
})
export class GameSearchComponent implements OnInit {
  searchText: string = '';
  games: Game[] = [];

  constructor(
    private gameService: GameService
  ) { }

  ngOnInit(): void {
  }

  search() {
    this.gameService.searchByName(this.searchText).subscribe(games => this.games = games);
  }
}
