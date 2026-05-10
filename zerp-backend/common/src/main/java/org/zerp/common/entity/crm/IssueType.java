package org.zerp.common.entity.crm;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Locale;

public enum IssueType {
    SERVICE_LEVEL,
    QUESTION;

    @JsonCreator
    public static IssueType fromJson(String rawValue) {
        return fromValue(rawValue);
    }

    public static IssueType fromValue(Object rawValue) {
        if (rawValue instanceof IssueType type) {
            return type;
        }
        if (rawValue == null) {
            throw new IllegalArgumentException("Issue type cannot be null");
        }

        String normalizedValue = String.valueOf(rawValue)
                .trim()
                .replace('-', '_')
                .replace(' ', '_')
                .toUpperCase(Locale.ROOT);
        if (normalizedValue.isEmpty()) {
            throw new IllegalArgumentException("Issue type cannot be empty");
        }

        try {
            return IssueType.valueOf(normalizedValue);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid issue type: " + rawValue, ex);
        }
    }
}
