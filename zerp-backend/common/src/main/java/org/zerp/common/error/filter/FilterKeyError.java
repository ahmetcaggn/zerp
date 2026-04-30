package org.zerp.common.error.filter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public final class FilterKeyError extends FilterError.Single {
    public FilterKeyError(String message, Exception exception) {
        super(message, exception);
    }

    private String key;
}
