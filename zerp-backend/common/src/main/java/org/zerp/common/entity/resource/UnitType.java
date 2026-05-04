package org.zerp.common.entity.resource;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public enum UnitType {
    PIECE("Piece", "pc", UnitSystem.COUNT, BigDecimal.ONE),
    GRAM("Gram", "g", UnitSystem.WEIGHT, BigDecimal.ONE),
    KILOGRAM("Kilogram", "kg", UnitSystem.WEIGHT, new BigDecimal("1000")),
    MILLILITER("Milliliter", "ml", UnitSystem.VOLUME, BigDecimal.ONE),
    LITER("Liter", "l", UnitSystem.VOLUME, new BigDecimal("1000"));

    private final String displayName;
    private final String abbreviation;
    private final UnitSystem unitSystem;
    private final BigDecimal conversionFactor;

    UnitType(String displayName, String abbreviation, UnitSystem unitSystem, BigDecimal conversionFactor) {
        this.displayName = displayName;
        this.abbreviation = abbreviation;
        this.unitSystem = unitSystem;
        this.conversionFactor = conversionFactor;
    }

}
