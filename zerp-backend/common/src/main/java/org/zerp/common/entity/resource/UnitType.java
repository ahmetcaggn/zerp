package org.zerp.common.entity.resource;

import lombok.Getter;

import java.math.BigDecimal;
import java.math.RoundingMode;

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

    public boolean isCompatibleWith(UnitType other) {
        return other != null && unitSystem == other.unitSystem;
    }

    public static BigDecimal convert(BigDecimal quantity, UnitType from, UnitType to) {
        if (quantity == null) {
            throw new IllegalArgumentException("Quantity is required");
        }
        if (from == null || to == null) {
            throw new IllegalArgumentException("Both source and target units are required");
        }
        if (!from.isCompatibleWith(to)) {
            throw new IllegalArgumentException("Incompatible unit conversion from " + from + " to " + to);
        }
        if (from == to) {
            return quantity;
        }

        BigDecimal normalized = quantity.multiply(from.getConversionFactor());
        return normalized.divide(to.getConversionFactor(), 6, RoundingMode.HALF_UP);
    }
}
