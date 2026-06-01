package com.easycommerce.server.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final SessionService sessionService;

    public AuthController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/session")
    public AuthSessionResponse initializeSession(HttpServletRequest request, HttpServletResponse response) {
        sessionService.getOrCreateSessionId(request, response);
        return new AuthSessionResponse(sessionService.getExpiresInSeconds());
    }
}
