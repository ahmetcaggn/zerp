/// The only ID of the tenant root aka TENANT_ROOT is a fixed UUID of all zeros.
///
/// This is because the tenant root is not an actual entity in the database, but
/// rather a virtual root that all tenants are children of. By using a fixed
/// UUID of all zeros, we can easily identify the tenant root and avoid any
/// potential conflicts with actual tenant IDs in the database.
const String kTenantRootId = '00000000-0000-0000-0000-000000000000';
