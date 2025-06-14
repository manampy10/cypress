describe("Connexion utilisateur", () => {
  it("affiche un message si les identifiants sont incorrects", () => {
    cy.visit("http://localhost:8080/#/login");

    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
    cy.get('[data-cy="login-input-password"]').type("mauvaismotdepasse");
    cy.get('[data-cy="login-submit"]').click();

    cy.get('[data-cy="login-errors"]')
      .should("be.visible")
      .and("contain", "Identifiants incorrects");
  });

  it("affiche un message si les identifiants sont corrects", () => {
    cy.visit("http://localhost:8080/#/login");

    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
    cy.get('[data-cy="login-input-password"]').type("testtest");
    cy.get('[data-cy="login-submit"]').click();

    cy.url().should("eq", "http://localhost:8080/#/");

    cy.get('[data-cy="nav-link-logout"]')
      .should("be.visible")
      .and("contain", "Déconnexion");
  });
});
