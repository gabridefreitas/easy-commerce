package com.easycommerce.server.auth;

import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class SessionService {

    private final String cookieName;
    private final Duration sessionTtl;
    private final boolean forceSecureCookie;

    public SessionService(
            @Value("${app.auth.cookie-name:easycommerce_session}") String cookieName,
            @Value("${app.auth.session-ttl:PT12H}") Duration sessionTtl,
            @Value("${app.auth.cookie-secure:false}") boolean forceSecureCookie) {
        this.cookieName = cookieName;
        this.sessionTtl = sessionTtl;
        this.forceSecureCookie = forceSecureCookie;
    }

    public String getOrCreateSessionId(HttpServletRequest request, HttpServletResponse response) {
        String sessionId = extractSessionId(request).orElseGet(this::generateSessionId);
        renewSessionCookie(sessionId, request, response);
        return sessionId;
    }

    public void rotateSession(HttpServletRequest request, HttpServletResponse response) {
        renewSessionCookie(generateSessionId(), request, response);
    }

    public long getExpiresInSeconds() {
        return sessionTtl.getSeconds();
    }

    private Optional<String> extractSessionId(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return Optional.empty();
        }

        return Arrays.stream(cookies)
                .filter(cookie -> cookieName.equals(cookie.getName()))
                .map(Cookie::getValue)
                .filter(value -> value != null && !value.isBlank())
                .findFirst();
    }

    private void renewSessionCookie(String sessionId, HttpServletRequest request, HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, sessionId)
                .httpOnly(true)
                .secure(isSecureRequest(request))
                .path("/")
                .sameSite("Lax")
                .maxAge(sessionTtl)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String generateSessionId() {
        return UUID.randomUUID().toString();
    }

    private boolean isSecureRequest(HttpServletRequest request) {
        if (forceSecureCookie) {
            return true;
        }

        String forwardedProto = request.getHeader("X-Forwarded-Proto");
        return request.isSecure() || "https".equalsIgnoreCase(forwardedProto);
    }
}
