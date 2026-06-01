package org.zerp.common.resource.util.filter;

import jakarta.persistence.criteria.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.zerp.common.error.filter.FilterError;
import org.zerp.common.error.filter.FilterValueError;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZonedDateTime;
import java.time.temporal.Temporal;
import java.util.List;
import java.util.UUID;

@Log4j2
@Component
public class FilterProcessor {
    @SuppressWarnings({"rawtypes", "unchecked", "unused"})
    public <T> Predicate generatePredicate(
            List<String> parts,
            String value,
            FilterOperator filterOperator,
            Root<T> root,
            CriteriaQuery<?> query,
            CriteriaBuilder cb
    ) {
        String key = String.join(".", parts);
        log.debug("Generating predicate: parts={}, operator={}, valueType={}",
                key, filterOperator, value);

        Path<?> path = _getPath(root, parts);
        Class<?> type = path.getJavaType();
        Object typedValue = _convertValue(value, type);

        Predicate predicate = switch (filterOperator) {
            case LIKE -> {
                if (!String.class.equals(type)) {
                    log.warn("LIKE operator applied to non-String field: field={}, type={}",
                            key, type.getSimpleName());
                    throw new IllegalArgumentException("LIKE operator only valid for String fields");
                }
                log.trace("Applying LIKE operator: field={}, pattern={}%...%",
                        key, value.toLowerCase());
                yield cb.like(cb.lower(path.as(String.class)), "%" + value.toLowerCase() + "%");
            }
            case GT -> {
                _validateComparableType(type, filterOperator, parts);
                log.trace("Applying GT operator: field={}, value={}", key, value);
                yield cb.greaterThan((Expression) path, (Comparable) typedValue);
            }
            case LT -> {
                _validateComparableType(type, filterOperator, parts);
                log.trace("Applying LT operator: field={}, value={}", key, value);
                yield cb.lessThan((Expression) path, (Comparable) typedValue);
            }
            case GTE -> {
                _validateComparableType(type, filterOperator, parts);
                log.trace("Applying GTE operator: field={}, value={}", key, value);
                yield cb.greaterThanOrEqualTo((Expression) path, (Comparable) typedValue);
            }
            case LTE -> {
                _validateComparableType(type, filterOperator, parts);
                log.trace("Applying LTE operator: field={}, value={}", key, value);
                yield cb.lessThanOrEqualTo((Expression) path, (Comparable) typedValue);
            }
            case EQUALS -> {
                log.trace("Applying EQUALS operator: field={}, value={}", key, value);
                yield cb.equal(path, typedValue);
            }
            case NOT_EQUALS -> {
                log.trace("Applying NOT_EQUALS operator: field={}, value={}", key, value);
                yield cb.notEqual(path, typedValue);
            }
            default -> {
                log.error("Unsupported filter operator: operator={}, field={}", filterOperator, key);
                throw new IllegalArgumentException("Unsupported filter operator: " + filterOperator);
            }
        };

        log.debug("Predicate generated successfully: field={}, operator={}",
                key, filterOperator);
        return predicate;
    }

    private <T> Path<?> _getPath(Root<T> root, List<String> parts) {
        String fieldPath = String.join(".", parts);
        log.trace("Resolving path: field={}, depth={}", fieldPath, parts.size());

        From<?, ?> from = root;
        Path<?> path = root;

        for (int i = 0; i < parts.size(); i++) {
            String part = parts.get(i);

            if (i < parts.size() - 1) {
                log.trace("Creating LEFT JOIN: field={}, segment={}/{}", part, i + 1, parts.size());
                from = from.join(part, JoinType.LEFT);
                path = from;
            } else {
                log.trace("Accessing final field: field={}", part);
                path = from.get(part);
            }
        }

        log.trace("Path resolved: field={}, resultType={}", fieldPath, path.getJavaType().getSimpleName());
        return path;
    }

    private Object _convertValue(String value, Class<?> type) {
        log.debug("Converting filter value: value={}, targetType={}", value, type.getSimpleName());

        try {
            if (UUID.class.equals(type)) {
                UUID result = UUID.fromString(value);
                log.trace("Successfully converted to UUID: original={}, result={}", value, result);
                return result;
            } else if (Integer.class.equals(type) || int.class.equals(type)) {
                Integer result = Integer.valueOf(value);
                log.trace("Successfully converted to Integer: original={}, result={}", value, result);
                return result;
            } else if (Long.class.equals(type) || long.class.equals(type)) {
                Long result = Long.valueOf(value);
                log.trace("Successfully converted to Long: original={}, result={}", value, result);
                return result;
            } else if (Double.class.equals(type) || double.class.equals(type)) {
                Double result = Double.valueOf(value);
                log.trace("Successfully converted to Double: original={}, result={}", value, result);
                return result;
            } else if (Boolean.class.equals(type) || boolean.class.equals(type)) {
                Boolean result = Boolean.valueOf(value);
                log.trace("Successfully converted to Boolean: original={}, result={}", value, result);
                return result;
            } else if (LocalDateTime.class.equals(type)) {
                LocalDateTime result;
                try {
                    if (!value.contains("T")) {
                        result = LocalDate.parse(value).atStartOfDay();
                    } else if (value.endsWith("Z") || value.contains("+") || value.matches(".*-\\d{2}:\\d{2}$")) {
                        result = ZonedDateTime.parse(value).toLocalDateTime();
                    } else {
                        result = LocalDateTime.parse(value);
                    }
                } catch (Exception e) {
                    result = LocalDateTime.parse(value); // fallback
                }
                log.trace("Successfully converted to LocalDateTime: original={}, result={}", value, result);
                return result;
            } else if (LocalDate.class.equals(type)) {
                LocalDate result;
                if (value.contains("T")) {
                    result = LocalDate.parse(value.substring(0, value.indexOf("T")));
                } else {
                    result = LocalDate.parse(value);
                }
                log.trace("Successfully converted to LocalDate: original={}, result={}", value, result);
                return result;
            } else if (OffsetDateTime.class.equals(type)) {
                OffsetDateTime result = OffsetDateTime.parse(value);
                log.trace("Successfully converted to OffsetDateTime: original={}, result={}", value, result);
                return result;
            } else if (ZonedDateTime.class.equals(type)) {
                ZonedDateTime result = ZonedDateTime.parse(value);
                log.trace("Successfully converted to ZonedDateTime: original={}, result={}", value, result);
                return result;
            } else if (Instant.class.equals(type)) {
                Instant result = Instant.parse(value);
                log.trace("Successfully converted to Instant: original={}, result={}", value, result);
                return result;
            } else if (Enum.class.isAssignableFrom(type)) {
                //noinspection unchecked,rawtypes
                Class<Enum> enumClass = (Class<Enum>) type.asSubclass(Enum.class);
                for (Enum<?> enumConstant : enumClass.getEnumConstants()) {
                    if (enumConstant.name().equalsIgnoreCase(value)) {
                        log.trace("Successfully converted to Enum (case-insensitive): original={}, result={}, enumType={}",
                                value, enumConstant, type.getSimpleName());
                        return enumConstant;
                    }
                }
                // Fallback to default Enum.valueOf to let it throw standard exception if not found
                @SuppressWarnings("unchecked")
                Enum<?> result = Enum.valueOf(enumClass, value);
                log.trace("Successfully converted to Enum: original={}, result={}, enumType={}",
                        value, result, type.getSimpleName());
                return result;
            }
            log.trace("No type conversion needed, returning value as String: value={}", value);
            return value;
        } catch (NumberFormatException e) {
            log.warn("Failed to convert filter value to number: value={}, targetType={}, error={}",
                    value, type.getSimpleName(), e.getMessage(), e);
            throw new FilterError.Runtime(new FilterValueError(value, "Invalid number format for value: "
                    + value + " expected type: " + type.getSimpleName(), e));
        } catch (IllegalArgumentException e) {
            log.warn("Failed to convert filter value: value={}, targetType={}, error={}",
                    value, type.getSimpleName(), e.getMessage());
            throw new FilterError.Runtime(new FilterValueError(value, "Invalid value: "
                    + value + " for type: " + type.getSimpleName(), e));
        } catch (Exception e) {
            log.error("Unexpected error during value conversion: value={}, targetType={}, error={}",
                    value, type.getSimpleName(), e.getMessage(), e);
            throw new FilterError.Runtime(new FilterValueError(value, "Unexpected error converting value: " + value + " to type: " +
                    type.getSimpleName(), e));
        }
    }

    private void _validateComparableType(Class<?> type, FilterOperator operator, List<String> parts) {
        String fieldPath = String.join(".", parts);

        // Boolean is technically Comparable but not meant for GT/LT/GTE/LTE
        if (Boolean.class.equals(type) || boolean.class.equals(type)) {
            log.warn("Comparison operator applied to Boolean field: field={}, operator={}",
                    fieldPath, operator);
            throw new IllegalArgumentException(
                    "Comparison operators (GT, LT, GTE, LTE) not supported for Boolean fields: " + fieldPath
            );
        }

        // Validate that the type is Comparable (safe for numeric and orderable types)
        boolean isComparable = type != null && (
                Number.class.isAssignableFrom(type) ||
                        String.class.equals(type) ||
                        UUID.class.equals(type) ||
                        Enum.class.isAssignableFrom(type) ||
                        Temporal.class.isAssignableFrom(type)
        );

        if (!isComparable) {
            log.warn("Comparison operator applied to non-comparable type: field={}, type={}, operator={}",
                    fieldPath, type != null ? type.getSimpleName() : null, operator);
            throw new IllegalArgumentException(
                    "Comparison operators not supported for type " + (type != null ? type.getSimpleName() : null) +
                            " on field: " + fieldPath
            );
        }
    }
}
