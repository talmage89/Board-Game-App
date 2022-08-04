import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { ListType } from 'src/app/enums/list-type';
import { Game } from 'src/app/interfaces/game';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-selections',
  templateUrl: './user-selections.component.html',
  styleUrls: ['./user-selections.component.scss']
})
export class UserSelectionsComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();

  listType: ListType;
  listTypeTitle: string;
  ownedGames: Game[];
  wishListGames: Game[];

  dataSource;
  displayedColumns = ['name', 'image', 'min_age', 'min_players', 'max_players', 'min_playtime', 'delete'];

  constructor(
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.listType = this.route.snapshot.routeConfig.path === 'owned' ? ListType.OWNED_LIST : ListType.WISH_LIST;
    this.listTypeTitle = this.listType === ListType.OWNED_LIST ? 'Owned Games' : 'Wishlist Games';

    if (this.listType === ListType.OWNED_LIST) {
      this.localStorageService.getGameList(ListType.OWNED_LIST);
      this.localStorageService.ownedGames.pipe(
          takeUntil(this.unsubscribe),
          tap(games => {
              this.ownedGames = games;
              this.dataSource = this.ownedGames;
          })
      ).subscribe();
  } else {
      this.localStorageService.getGameList(ListType.WISH_LIST);
      this.localStorageService.wishListGames.pipe(
          takeUntil(this.unsubscribe),
          tap(games => {
              this.wishListGames = games;
              this.dataSource = this.wishListGames;
          })
      ).subscribe();
  }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  deleteGame(game: Game) {
    if (this.listType === ListType.OWNED_LIST) this.localStorageService.deleteGame(game, ListType.OWNED_LIST);
    else this.localStorageService.deleteGame(game, ListType.WISH_LIST);
  }
}
