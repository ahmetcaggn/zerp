<!DOCTYPE html>
<#assign currentLanguageTag = ((locale.currentLanguageTag)!"tr")?lower_case>
<#assign trUrl = "">
<#assign enUrl = "">
<#if realm.internationalizationEnabled && locale.supported?size gt 1>
  <#list locale.supported as l>
    <#assign languageTag = l.languageTag?lower_case>
    <#if languageTag?starts_with("tr")>
      <#assign trUrl = l.url>
    <#elseif languageTag?starts_with("en")>
      <#assign enUrl = l.url>
    </#if>
  </#list>
  <#if !trUrl?has_content || !enUrl?has_content>
    <#list locale.supported as l>
      <#if !trUrl?has_content>
        <#assign trUrl = l.url>
      <#elseif !enUrl?has_content && l.url != trUrl>
        <#assign enUrl = l.url>
      </#if>
    </#list>
  </#if>
</#if>
<#assign isTr = currentLanguageTag?starts_with("tr")>
<html lang="${currentLanguageTag}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ZERP | ${msg("zerpLoginTitle")}</title>
  <link rel="stylesheet" href="${url.resourcesPath}/css/zerp-auth.css">
</head>
<body>
<main class="zerp-auth-page">
  <header class="zerp-header">
    <div class="zerp-header__container">
      <details class="zerp-language">
        <summary class="zerp-language__trigger" aria-label="${msg("zerpLanguages")}">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.93 9h-3.12a15.8 15.8 0 0 0-1.12-5.13A8.04 8.04 0 0 1 18.93 11ZM12 4.04c.77 1.09 1.49 3.02 1.68 6.96H10.32c.19-3.94.91-5.87 1.68-6.96ZM4.07 13h3.12c.16 2.08.53 3.83 1.12 5.13A8.04 8.04 0 0 1 4.07 13Zm3.12-2H4.07a8.04 8.04 0 0 1 4.24-5.13A15.8 15.8 0 0 0 7.19 11ZM12 19.96c-.77-1.09-1.49-3.02-1.68-6.96h3.36c-.19 3.94-.91 5.87-1.68 6.96Zm2.69-1.83c.59-1.3.96-3.05 1.12-5.13h3.12a8.04 8.04 0 0 1-4.24 5.13Z" />
          </svg>
        </summary>
        <nav class="zerp-language__menu" aria-label="${msg("zerpLanguages")}">
          <a
            class="zerp-language__item <#if isTr>zerp-language__item--active</#if>"
            href="<#if trUrl?has_content>${trUrl}<#else>#</#if>"
            hreflang="tr"
            data-locale-link
            data-locale="tr"
          >
            TR
          </a>
          <a
            class="zerp-language__item <#if !isTr>zerp-language__item--active</#if>"
            href="<#if enUrl?has_content>${enUrl}<#else>#</#if>"
            hreflang="en"
            data-locale-link
            data-locale="en"
          >
            EN
          </a>
        </nav>
      </details>
    </div>
  </header>

  <section class="zerp-auth-main" aria-labelledby="zerp-brand">
    <div class="zerp-auth-container">
      <div class="zerp-brand-block">
        <h1 id="zerp-brand" class="zerp-brand">ZERP</h1>
        <p class="zerp-brand-subtitle">${msg("zerpBrandSubtitle")}</p>
      </div>

      <article class="zerp-card" aria-labelledby="kc-page-title">
        <div class="zerp-card-header">
          <h2 id="kc-page-title" class="zerp-card-title">${msg("zerpLoginTitle")}</h2>
          <p class="zerp-card-description">${msg("zerpLoginSubtitle")}</p>
        </div>

        <#if message?has_content>
          <div class="zerp-alert zerp-alert-${message.type}" role="alert">
            ${kcSanitize(message.summary)?no_esc}
          </div>
        </#if>

        <#if realm.password>
          <form id="kc-form-login" class="zerp-form" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
            <#if !usernameHidden??>
              <div class="zerp-form-group">
                <label class="zerp-label" for="username">
                  <#if !realm.loginWithEmailAllowed>${msg("username")}<#elseif !realm.registrationEmailAsUsername>${msg("zerpEmailLabel")}<#else>${msg("email")}</#if>
                </label>
                <#if usernameEditDisabled??>
                  <input id="username" class="zerp-input" name="username" type="text" value="${(login.username!'')}" readonly="readonly" autocomplete="username">
                <#else>
                  <input
                    id="username"
                    class="zerp-input"
                    name="username"
                    type="text"
                    value="${(login.username!'')}"
                    autofocus
                    required
                    autocomplete="username"
                    placeholder="${msg("zerpEmailPlaceholder")}"
                    aria-invalid="<#if messagesPerField.existsError('username', 'password')>true<#else>false</#if>"
                  >
                </#if>
              </div>
            </#if>

            <div class="zerp-form-group">
              <label class="zerp-label" for="password">${msg("zerpPasswordLabel")}</label>
              <div class="zerp-password">
                <input
                  id="password"
                  class="zerp-input"
                  name="password"
                  type="password"
                  required
                  autocomplete="current-password"
                  placeholder="${msg("zerpPasswordPlaceholder")}"
                  aria-invalid="<#if messagesPerField.existsError('username', 'password')>true<#else>false</#if>"
                >
                <button class="zerp-password__toggle" type="button" aria-label="${msg("zerpTogglePassword")}" data-password-toggle>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 5.5c4.4 0 7.7 3.4 9 6.5-1.3 3.1-4.6 6.5-9 6.5S4.3 15.1 3 12c1.3-3.1 4.6-6.5 9-6.5Zm0 11c2.9 0 5.4-2 6.8-4.5C17.4 9.5 14.9 7.5 12 7.5S6.6 9.5 5.2 12c1.4 2.5 3.9 4.5 6.8 4.5Zm0-7.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
                  </svg>
                </button>
              </div>
              <#if messagesPerField.existsError('username', 'password')>
                <span class="zerp-field-error" id="input-error">
                  ${kcSanitize(messagesPerField.getFirstError('username', 'password'))?no_esc}
                </span>
              </#if>
            </div>

            <#if realm.rememberMe && !usernameEditDisabled?? && !usernameHidden??>
              <label class="zerp-checkbox-row" for="rememberMe">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  <#if login.rememberMe??>checked</#if>
                >
                <span>${msg("rememberMe")}</span>
              </label>
            </#if>

            <#if auth?has_content && auth.selectedCredential?has_content>
              <input type="hidden" name="credentialId" value="${auth.selectedCredential}">
            </#if>

            <button class="zerp-primary-button" name="login" id="kc-login" type="submit">${msg("doLogIn")}</button>

            <#if realm.password && auth?has_content && auth.showTryAnotherWayLink()>
              <button class="zerp-try-another" type="submit" name="tryAnotherWay" value="on">
                ${msg("doTryAnotherWay")}
              </button>
            </#if>
          </form>
        </#if>
      </article>
    </div>
  </section>
</main>

<script>
  (function () {
    var localeParam = new URLSearchParams(window.location.search).get("kc_locale");
    var hasLocaleCookie = document.cookie.split(";").some(function (item) {
      return item.trim().indexOf("KEYCLOAK_LOCALE=") === 0;
    });

    if (!localeParam && !hasLocaleCookie && "${currentLanguageTag}" !== "tr") {
      var target = new URL(window.location.href);
      target.searchParams.set("kc_locale", "tr");
      window.location.replace(target.toString());
      return;
    }

    var localeLinks = document.querySelectorAll("[data-locale-link]");
    localeLinks.forEach(function (link) {
      if (link.getAttribute("href") !== "#") {
        return;
      }

      var localeTarget = new URL(window.location.href);
      localeTarget.searchParams.set("kc_locale", link.getAttribute("data-locale"));
      link.setAttribute("href", localeTarget.toString());
    });

    var toggle = document.querySelector("[data-password-toggle]");
    var password = document.getElementById("password");

    if (!toggle || !password) {
      return;
    }

    toggle.addEventListener("click", function () {
      password.type = password.type === "password" ? "text" : "password";
    });
  }());
</script>
</body>
</html>
