package com.vaadin.componentfactory.enhancedcrud;

import com.vaadin.flow.testutil.ClassesSerializableTest;
import org.junit.Ignore;

import java.util.stream.Stream;

@Ignore
public class CrudSerializableTest extends ClassesSerializableTest {

    @Override
    protected Stream<String> getExcludedPatterns() {
        return Stream.concat(super.getExcludedPatterns(), Stream.of(
                "com\\.vaadin\\.flow\\.component\\.contextmenu\\.osgi\\..*",
                "com\\.vaadin\\.flow\\.component\\.grid\\.GridColumnOrderHelper.*",
                "com\\.vaadin\\.flow\\.component\\.grid\\.osgi\\..*"));
    }
}
