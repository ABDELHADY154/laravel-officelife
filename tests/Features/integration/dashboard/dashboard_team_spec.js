describe('Dashboard - teams', function () {
  it('should display an empty tab when not associated with a team', function () {
    cy.login()

    cy.createCompany()

    cy.visit('/1/dashboard/me')
    cy.get('[data-cy=dashboard-team-tab]').click()

    cy.contains('You are not associated with a team at the moment')
  })

  it('should display the list of teams if the employee is associated with at least one team', function () {
    cy.login()

    cy.createCompany()

    cy.createTeam('product')
    cy.createTeam('sales')

    // assign a first team
    cy.visit('/1/employees/1')

    cy.get('[data-cy=open-team-modal-blank]').click()
    cy.get('[data-cy=list-team-1]').click()

    cy.visit('/1/dashboard')

    cy.get('[data-cy=dashboard-team-tab]').click()

    cy.contains('What your team has done this week')

    // assign a second team
    cy.visit('/1/employees/1')
    cy.get('[data-cy=open-team-modal]').click()
    cy.get('[data-cy=list-team-2]').click()

    cy.visit('/1/dashboard')

    cy.get('[data-cy=dashboard-team-tab]').click()

    cy.contains('What your team has done this week')
    cy.contains('Viewing')
    cy.contains('product')
    cy.contains('sales')
  })

  it('should display the upcoming birthdays of employees on the team dashboard', function () {
    cy.login()

    cy.createCompany()
    cy.createTeam('product')

    cy.wait(1000)
    cy.assignEmployeeToTeam(1, 1)

    // visit the dashboard, the team tab and find that the birthday is empty
    cy.visit('/1/dashboard')
    cy.get('[data-cy=dashboard-team-tab]').click()
    cy.get('[data-cy=team-birthdate-blank]').should('exist')

    // edit the user birthdate
    cy.visit('/1/employees/1')
    cy.get('[data-cy=edit-profile-button]').click()
    cy.get('[data-cy=show-edit-view]').click()
    cy.get('input[name=firstname]').type('dwight')
    cy.get('input[name=lastname]').type('schrute')
    cy.get('input[name=email]').clear()
    cy.get('input[name=email]').type('dwight@dundermifflin.com')
    cy.get('input[name=year]').type('1981')
    cy.get('input[name=month]').type(Cypress.moment().add(2, 'days').month() + 1)
    cy.get('input[name=day]').type(Cypress.moment().add(2, 'days').date())
    cy.get('[data-cy=submit-edit-employee-button]').click()

    // now, on the dashboard team tab, there should be a birthdate
    cy.visit('/1/dashboard')
    cy.get('[data-cy=dashboard-team-tab]').click()
    cy.get('[data-cy=team-birthdate-blank]').should('not.exist')
    cy.get('[data-cy=birthdays-list]').contains('dwight schrute')

    // change the birthdate and make sure the birthdate doesn't appear anymore
    // edit the user birthdate
    cy.visit('/1/employees/1')
    cy.get('[data-cy=edit-profile-button]').click()
    cy.get('[data-cy=show-edit-view]').click()
    cy.get('input[name=month]').clear()
    cy.get('input[name=month]').type(Cypress.moment().add(40, 'days').month() + 1)
    cy.get('input[name=day]').clear()
    cy.get('input[name=day]').type(Cypress.moment().add(40, 'days').date())
    cy.get('[data-cy=submit-edit-employee-button]').click()

    cy.visit('/1/dashboard')
    cy.get('[data-cy=dashboard-team-tab]').click()
    cy.get('[data-cy=team-birthdate-blank]').should('exist')
  })

  it('should display the employees of this team who work from home today', function () {
    cy.login()

    cy.createCompany()
    cy.createTeam('product')

    cy.wait(1000)
    cy.assignEmployeeToTeam(1, 1)

    // visit the dashboard, the team tab and find that the birthday is empty
    cy.visit('/1/dashboard')
    cy.get('[data-cy=dashboard-team-tab]').click()
    cy.get('[data-cy=team-work-from-home-blank]').should('exist')

    // indicate that the employee works from home
    cy.visit('/1/dashboard/me')
    cy.get('[data-cy=log-from-work-home-cta]').check()

    // now, on the dashboard team tab, there should be the employee indicating
    // that he works from home
    cy.visit('/1/dashboard')
    cy.get('[data-cy=dashboard-team-tab]').click()
    cy.get('[data-cy=team-work-from-home-blank]').should('not.exist')
    cy.get('[data-cy=work-from-home-list]').contains('admin@admin.com')
  })
})