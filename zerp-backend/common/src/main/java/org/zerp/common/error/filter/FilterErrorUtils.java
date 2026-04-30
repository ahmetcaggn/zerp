package org.zerp.common.error.filter;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

abstract public class FilterErrorUtils {
    public static ResponseStatusException toResponseStatusException(FilterError error) {
        switch (error) {
            case FilterError.Single single -> {
                if (single instanceof FilterKeyError keyError) {
                    return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter key: " + keyError.getKey(), keyError.getException());
                } else if (single instanceof FilterValueError valueError) {
                    return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter value: " + valueError.getValue(), valueError.getException());
                }
                return new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred while processing filters.", error);
            }
            case FilterError.Multiple multiple -> {
                List<String> messages = multiple.getErrors().stream().map(e -> switch (e) {
                    case FilterKeyError fke -> String.format("Invalid filter key: %s", fke.getKey());
                    case FilterValueError fve ->
                            String.format("Invalid filter value: %s - %s", fve.getValue(), fve.getMessage());
                }).toList();
                return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Invalid filters: [%s]".formatted(String.join("; ", messages)));
            }
        }
    }
}
