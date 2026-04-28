package org.zerp.common.resource.util.filter;

import jakarta.persistence.criteria.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

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
        log.debug("Generating predicate: parts={}, operator={}, valueType={}",
                String.join(".", parts), filterOperator, value);

        Path<?> path = _getPath(root, parts);
        Class<?> type = path.getJavaType();
        Object typedValue = _convertValue(value, type);

        Predicate predicate = switch (filterOperator) {
            case LIKE -> {
                if (!String.class.equals(type)) {
                    log.warn("LIKE operator applied to non-String field: field={}, type={}",
                            String.join(".", parts), type.getSimpleName());
                    throw new IllegalArgumentException("LIKE operator only valid for String fields");
                }
                log.trace("Applying LIKE operator: field={}, pattern={}%...%",
                        String.join(".", parts), value.toLowerCase());
                yield cb.like(cb.lower(path.as(String.class)), "%" + value.toLowerCase() + "%");
            }
            case GT -> {
                log.trace("Applying GT operator: field={}, value={}", String.join(".", parts), value);
                yield cb.greaterThan(path.as(Comparable.class), (Comparable) typedValue);
            }
            case LT -> {
                log.trace("Applying LT operator: field={}, value={}", String.join(".", parts), value);
                yield cb.lessThan(path.as(Comparable.class), (Comparable) typedValue);
            }
            case GTE -> {
                log.trace("Applying GTE operator: field={}, value={}", String.join(".", parts), value);
                yield cb.greaterThanOrEqualTo(path.as(Comparable.class), (Comparable) typedValue);
            }
            case LTE -> {
                log.trace("Applying LTE operator: field={}, value={}", String.join(".", parts), value);
                yield cb.lessThanOrEqualTo(path.as(Comparable.class), (Comparable) typedValue);
            }
            case EQUALS -> {
                log.trace("Applying EQUALS operator: field={}, value={}", String.join(".", parts), value);
                yield cb.equal(path, typedValue);
            }
            case NOT_EQUALS -> {
                log.trace("Applying NOT_EQUALS operator: field={}, value={}", String.join(".", parts), value);
                yield cb.notEqual(path, typedValue);
            }
            default -> {
                log.error("Unsupported filter operator: operator={}, field={}", filterOperator, String.join(".", parts));
                throw new IllegalArgumentException("Unsupported filter operator: " + filterOperator);
            }
        };

        log.debug("Predicate generated successfully: field={}, operator={}",
                String.join(".", parts), filterOperator);
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
            } else if (Enum.class.isAssignableFrom(type)) {
                //noinspection unchecked,rawtypes
                Enum<?> result = Enum.valueOf((Class<Enum>) type.asSubclass(Enum.class), value);
                log.trace("Successfully converted to Enum: original={}, result={}, enumType={}",
                        value, result, type.getSimpleName());
                return result;
            }
            log.trace("No type conversion needed, returning value as String: value={}", value);
            return value;
        } catch (IllegalArgumentException e) {
            log.error("Failed to convert filter value: value={}, targetType={}, error={}",
                    value, type.getSimpleName(), e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during value conversion: value={}, targetType={}, error={}",
                    value, type.getSimpleName(), e.getMessage(), e);
            throw new IllegalArgumentException("Value conversion failed for value=" + value + " to type=" + type.getSimpleName(), e);
        }
    }
}
