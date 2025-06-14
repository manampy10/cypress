describe("Test XSS via les commentaires", () => {
  it("rejette une tentative d'injection XSS dans les commentaires", () => {
    const xssPayload = '<script>alert("XSS")</script>';

    cy.request({
      method: "POST",
      url: "http://localhost:8081/login",
      body: {
        username: "test2@test.fr",
        password: "testtest",
      },
      failOnStatusCode: false,
    }).then((loginResponse) => {
      const token = loginResponse.body.token;
      expect(token, "JWT attendu").to.exist;

      cy.request({
        method: "POST",
        url: "http://localhost:8081/reviews",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          product: 3,
          note: 5,
          title: "Test XSS",
          comment: xssPayload,
        },
        failOnStatusCode: false,
      }).then((response) => {
        // ✅ Valider le code HTTP
        expect([400, 422]).to.include(response.status);

        // ✅ Ne pas faire un `not.to.include` directement sur un objet
        const responseText = JSON.stringify(response.body);
        expect(responseText).not.to.include("<script>");
      });
    });
  });
});
