package com.vaadin.flow.component.crud.examples;

import com.vaadin.flow.component.button.Button;
import com.vaadin.componentfactory.enhancedcrud.Crud;
import com.vaadin.componentfactory.enhancedcrud.CrudVariant;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.page.BodySize;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.theme.Theme;
import com.vaadin.flow.theme.lumo.Lumo;

@Route
@Theme(Lumo.class)
@BodySize(height = "100vh", width = "100vw")
public class CustomGridView extends VerticalLayout {

    boolean hasBorder = true;

    public CustomGridView() {
        final Grid<Person> grid = new Grid<>(Person.class);
        final Crud<Person> crud = new Crud<>(Person.class, grid,
                Helper.createPersonEditor());

        PersonCrudDataProvider dataProvider = new PersonCrudDataProvider();

        grid.setDataProvider(dataProvider);
        crud.addSaveListener(e -> dataProvider.persist(e.getItem()));
        crud.addDeleteListener(e -> dataProvider.delete(e.getItem()));

        Crud.addEditColumn(grid);

        // no-border should not be reflected to the custom grid
        final Button toggleBordersButton = new Button("Toggle borders",
                event -> {
                    if (hasBorder) {
                        crud.addThemeVariants(CrudVariant.NO_BORDER);
                    } else {
                        crud.removeThemeVariants(CrudVariant.NO_BORDER);
                    }
                    hasBorder = !hasBorder;
                });
        toggleBordersButton.setId("toggleBorders");

        setHeight("100%");
        add(crud, toggleBordersButton);
    }
}
