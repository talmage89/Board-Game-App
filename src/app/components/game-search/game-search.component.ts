import { Component, OnInit } from '@angular/core';
import { ListType } from 'src/app/enums/list-type';
import { Game } from 'src/app/interfaces/game';
import { GameService } from 'src/app/services/game.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-game-search',
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.scss']
})
export class GameSearchComponent implements OnInit {
  searchText: string = '';
  games: Game[] = [];
  ownedGames: { [id: string]: Game } = {};
  wishListGames: { [id: string]: Game } = {};

  constructor(
    private gameService: GameService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.localStorageService.getGameList(ListType.OWNED_LIST);
    this.localStorageService.getGameList(ListType.WISH_LIST);

    this.localStorageService.ownedGames.subscribe(games => this.ownedGames = _.mapKeys(games, 'id'));
    this.localStorageService.wishListGames.subscribe(games => this.wishListGames = _.mapKeys(games, 'id'));
  }

  search() {
    this.gameService.searchByName(this.searchText).subscribe(games => this.games = games);
  }

  updateOwnedList(event: MouseEvent, game: Game) {
    event.stopPropagation();

    if (this.ownedGames[game.id]) {
      this.localStorageService.deleteGame(game, ListType.OWNED_LIST);
    } else {
      if (this.wishListGames[game.id]) {
        this.localStorageService.deleteGame(game, ListType.WISH_LIST);
      }
      this.localStorageService.saveGame(game, ListType.OWNED_LIST);
    }
  }

  updateWishlist(event: MouseEvent, game: Game) {
    event.stopPropagation();

    if (this.wishListGames[game.id]) {
      this.localStorageService.deleteGame(game, ListType.WISH_LIST);
    } else {
      if (this.ownedGames[game.id]) {
        this.localStorageService.deleteGame(game, ListType.OWNED_LIST);
      }
      this.localStorageService.saveGame(game, ListType.WISH_LIST);
    }
  }

  goToGameDetails(game: Game): void {
    this.router.navigate(['./game-details', {gameId: game.id}]);
  }
}
