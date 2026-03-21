package org.zerp.common.resource.util;

public enum FilterType {
    EQUAL("eq"),
    NOT_EQUAL("neq"),
    GREATER_THAN_OR_EQUAL("gte"),
    LESS_THAN_OR_EQUAL("lte"),
    LIKE("like");

    private final String code;

    FilterType(String code) {
        this.code = code;
    }

    public static FilterType fromCode(String code) {
        for (FilterType type : values()) {
            if (type.code.equalsIgnoreCase(code)) return type;
        }
        return null;
    }
}
