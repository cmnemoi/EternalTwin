import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ArchiveHomeView } from "./archive-home.view";

const routes: Routes = [
  {path: "", component: ArchiveHomeView, pathMatch: "full"},
  {path: "hammerfest", loadChildren: () => import("./hammerfest/hammerfest.module").then(({HammerfestModule}) => HammerfestModule)},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class ArchiveRoutingModule {
}