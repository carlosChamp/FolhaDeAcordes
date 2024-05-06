export class AcordesData {
  static #acordes;
  static get AcordesCadastrados() {
    if (this.#acordes != null) return this.#acordes;

    return fetch("https://raw.githubusercontent.com/carlosChamp/FolhaDeAcordes/master/acordes.json", {cache: "no-store"})
      .then((response) => {
        if (!response.ok) return;
        return response.json();
      })
      .then((data) => {
        this.#acordes = data;
        console.log(this.#acordes);
        return this.#acordes;
      });
  }
}
