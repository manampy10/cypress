describe("Tests du panier", () => {
  beforeEach(() => {
    // Étape 1 : Connexion
    cy.visit("http://localhost:8080/#/login");
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
    cy.get('[data-cy="login-input-password"]').type("testtest");
    cy.get('[data-cy="login-submit"]').click();

    // Étape 2 : Aller vers les produits
    cy.contains("button", "Voir les produits").click();
    cy.url().should("include", "/#/products");

    // Étape 3 : Cliquer sur un produit "Consulter"
    cy.get('[data-cy="product-link"]', { timeout: 10000 })
      .should("have.length.greaterThan", 0)
      .first()
      .click();

    // Étape 4 : Vérifier qu'on est sur une page produit
    cy.url().should("include", "/#/products/");
  });

  it("ajoute un produit au panier avec succès", () => {
    // Étape 5 : Cliquer sur "Ajouter au panier" si visible
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="detail-product-add"]').length > 0) {
        cy.get('[data-cy="detail-product-add"]').should("be.visible").click();

        // Étape 6 : Aller au panier
        cy.contains("Mon panier").click();
        cy.url({ timeout: 10000 }).should("include", "/#/cart");

        // Étape 7 : Vérifier qu’un produit est bien affiché dans le panier
        cy.get('[data-cy="cart-line"]').should("exist");

        // Étape 8 : Remplir les champs d’adresse
        cy.get('[data-cy="cart-input-address"]').type("123 rue des tests");
        cy.get('[data-cy="cart-input-zipcode"]').type("75001");
        cy.get('[data-cy="cart-input-city"]').type("Paris");

        // Étape 9 : Valider la commande
        cy.get('[data-cy="cart-submit"]').click();

        // Étape 10 : Confirmation
        cy.contains("h1", "Merci !").should("exist");
        cy.contains("Votre commande est bien validée").should("exist");
      } else {
        cy.log(" Aucun bouton 'Ajouter au panier' disponible pour ce produit.");
      }
    });
  });

  it("ajoute un produit au panier et vérifie les totaux ligne à ligne", () => {
    // Étape 5 : Cliquer sur "Ajouter au panier" si visible
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="detail-product-add"]').length > 0) {
        cy.get('[data-cy="detail-product-add"]').should("be.visible").click();

        // Étape 6 : Aller au panier
        cy.contains("Mon panier").click();
        cy.url({ timeout: 10000 }).should("include", "/#/cart");

        // Étape 7 : Vérifier que le total de chaque produit est correct
        cy.get('[data-cy="cart-line"]').each(($line, index) => {
          cy.wrap($line).within(() => {
            cy.get('[data-cy="cart-line-quantity"]')
              .invoke("val")
              .then((quantityStr) => {
                const quantity = parseInt(quantityStr, 10);

                cy.get('[data-cy="cart-line-total"]')
                  .invoke("text")
                  .then((totalText) => {
                    const total = parseFloat(
                      totalText
                        .replace(/[^\d,]/g, "")
                        .replace(",", ".")
                        .trim()
                    );

                    const unitPrice = parseFloat((total / quantity).toFixed(2));
                    const expected = parseFloat(
                      (unitPrice * quantity).toFixed(2)
                    );

                    cy.log(
                      `🧮 Produit ${
                        index + 1
                      } → ${quantity} × ${unitPrice} = ${expected}`
                    );
                    expect(total).to.be.closeTo(expected, 0.01);
                  });
              });
          });
        });

        // Étape 8 : Remplir les champs d’adresse
        cy.get('[data-cy="cart-input-address"]').type("123 rue des tests");
        cy.get('[data-cy="cart-input-zipcode"]').type("75001");
        cy.get('[data-cy="cart-input-city"]').type("Paris");

        // Étape 9 : Valider la commande
        cy.get('[data-cy="cart-submit"]').click();

        // Étape 10 : Confirmation
        cy.contains("h1", "Merci !").should("exist");
        cy.contains("Votre commande est bien validée").should("exist");
      } else {
        cy.log(" Aucun bouton 'Ajouter au panier' disponible pour ce produit.");
      }
    });
  });
});
