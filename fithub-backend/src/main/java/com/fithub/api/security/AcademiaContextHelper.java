package com.fithub.api.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AcademiaContextHelper {

    private final JwtService jwtService;

    public UUID getAcademiaIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        String academiaId = jwtService.extractClaim(token, claims -> claims.get("academiaId", String.class));
        return academiaId != null ? UUID.fromString(academiaId) : null;
    }
}