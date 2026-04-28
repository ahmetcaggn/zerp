package org.zerp.common.resource.util.filter;

import java.util.Map;

public enum FilterOperator {
    EQUALS,
    NOT_EQUALS,
    LIKE,
    GT,
    LT,
    GTE,
    LTE,
    NONE,
    ;

    public static final Map<String, FilterOperator> OPERATOR_MAP = Map.of(
            "like", LIKE,
            "gt", GT,
            "lt", LT,
            "gte", GTE,
            "lte", LTE,
            "eq", EQUALS,
            "neq", NOT_EQUALS
    );

    public static FilterOperator fromKey(String key) {
        return OPERATOR_MAP.getOrDefault(key.toLowerCase(), NONE);
    }
}
