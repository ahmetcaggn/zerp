package org.zerp.common.error.filter;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public final class FilterValueError extends FilterError.Single {
    public FilterValueError(String value, String message, Exception exception) {
        this.value = value;
        super(message, exception);
    }

    private String value;
}
