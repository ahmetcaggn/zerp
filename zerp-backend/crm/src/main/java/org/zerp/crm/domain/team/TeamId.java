package org.zerp.crm.domain.team;

import java.util.Objects;

public class TeamId {

    private final Integer value;

    private TeamId(Integer value) {
        this.value = Objects.requireNonNull(value, "TeamId cannot be null");
    }

    public static TeamId of(Integer value) {
        return new TeamId(value);
    }

    public static TeamId of(String value) {
        return new TeamId(Integer.parseInt(value));
    }

    public Integer getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        TeamId teamId = (TeamId) o;
        return Objects.equals(value, teamId.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
