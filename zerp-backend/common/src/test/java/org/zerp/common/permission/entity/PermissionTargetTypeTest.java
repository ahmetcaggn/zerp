package org.zerp.common.permission.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class PermissionTargetTypeTest {

    @PermissionTargetTypeAnnotation(type = PermissionTargetType.USER)
    static class MockUserEntity implements Permittable {
        @Override
        public String getTitle() { return "MockUser"; }

        @Override
        public Permittable getParent() { return null; }

        @Override
        public java.util.UUID getId() { return java.util.UUID.randomUUID(); }
    }

    @PermissionTargetTypeAnnotation(type = PermissionTargetType.EMPLOYEE)
    static class MockEmployeeEntity extends MockUserEntity {
    }

    static class EntityWithoutAnnotation implements Permittable {
        @Override
        public String getTitle() { return "NoAnnotation"; }

        @Override
        public Permittable getParent() { return null; }

        @Override
        public java.util.UUID getId() { return java.util.UUID.randomUUID(); }
    }

    @Test
    void testFromType_WithAnnotation() {
        MockUserEntity user = new MockUserEntity();
        assertEquals(PermissionTargetType.USER, PermissionTargetType.fromType(user));
    }

    @Test
    void testFromType_SubclassWithOwnAnnotation() {
        MockEmployeeEntity employee = new MockEmployeeEntity();
        assertEquals(PermissionTargetType.EMPLOYEE, PermissionTargetType.fromType(employee));
    }

    @Test
    void testFromType_NullEntity() {
        assertThrows(IllegalArgumentException.class, () -> PermissionTargetType.fromType(null));
    }

    @Test
    void testFromType_WithoutAnnotation() {
        EntityWithoutAnnotation entity = new EntityWithoutAnnotation();
        assertThrows(IllegalArgumentException.class, () -> PermissionTargetType.fromType(entity));
    }

    @Test
    void testFromType_WithHibernateProxy() {
        org.hibernate.proxy.HibernateProxy mockProxy = org.mockito.Mockito.mock(org.hibernate.proxy.HibernateProxy.class);
        org.hibernate.proxy.LazyInitializer mockInitializer = org.mockito.Mockito.mock(org.hibernate.proxy.LazyInitializer.class);
        org.mockito.Mockito.when(mockProxy.getHibernateLazyInitializer()).thenReturn(mockInitializer);
        org.mockito.Mockito.doReturn(MockEmployeeEntity.class).when(mockInitializer).getPersistentClass();

        assertEquals(PermissionTargetType.EMPLOYEE, PermissionTargetType.fromType(mockProxy));
    }
}
