package org.zerp.crm.domain.team;

public enum TeamRole {
    LEADER("Leader"),
    MEMBER("Member");

    private final String displayName;

    TeamRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
