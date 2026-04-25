package com.fithub.api.controller;

import com.fithub.api.dto.dashboard.DashboardResponse;
import com.fithub.api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getMetrics() {
        return ResponseEntity.ok(dashboardService.getMetrics());
    }
}