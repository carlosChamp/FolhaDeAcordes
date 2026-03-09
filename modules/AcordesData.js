export class AcordesData {
  static #acordes;
  static get AcordesCadastrados() {
    if (this.#acordes != null) return this.#acordes;

    return fetch("acordes.json?nocache="+new Date(), {cache: "no-store"})
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
