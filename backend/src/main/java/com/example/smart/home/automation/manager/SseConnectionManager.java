package com.example.smart.home.automation.manager;

import com.example.smart.home.automation.enums.ConnectionStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class SseConnectionManager {

    private static final Long SSE_TIMEOUT = 0L;

    private static final String EVENT_CONNECTED = "connected";
    private static final String EVENT_LINKED = "linked";

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter addEmitter(String agentId) {

        removeEmitter(agentId);

        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);

        emitters.put(agentId, emitter);

        emitter.onCompletion(() -> {
            removeEmitter(agentId);
            log.info("\n \n SSE CONNECTION COMPLETED - LOCAL-AGENT-ID: {} \n", agentId);
        });

        emitter.onTimeout(() -> {
            removeEmitter(agentId);
            log.warn("\n \n SSE CONNECTION TIMEOUT - LOCAL-AGENT-ID: {} \n", agentId);
        });

        emitter.onError(error -> {
            removeEmitter(agentId);
            log.error("\n \n SSE CONNECTION ERROR - LOCAL-AGENT-ID: {} \n", agentId, error);
        });

        try {
            emitter.send(SseEmitter.event().name(EVENT_CONNECTED).data("connected"));
        } catch (IOException e) {
            removeEmitter(agentId);
            emitter.completeWithError(e);
            log.error("\n \n FAILED TO ESTABLISH SSE CONNECTION - LOCAL-AGENT-ID: {} \n", agentId, e);
        }

        log.info("\n \n SSE CONNECTION ESTABLISHED - LOCAL-AGENT-ID: {} \n", agentId);

        return emitter;

    }

    public void notifyLinked(String agentId) {

        SseEmitter emitter = emitters.get(agentId);

        if (emitter == null) {
            log.warn("\n \n NO ACTIVE SSE CONNECTION COMPLETED - LOCAL-AGENT-ID: {} \n", agentId);
            return;
        }

        try {

            emitter.send(SseEmitter.event()
                    .name(EVENT_LINKED)
                    .data(ConnectionStatus.LINKED.name())
            );

            log.info("\n \n LOCAL AGENT STATUS SENT - LOCAL-AGENT-ID: {} \n", agentId);

        } catch (IOException ex) {

            removeEmitter(agentId);

            emitter.completeWithError(ex);

            log.error("\n \n FAILED TO SENT LOCAL AGENT STATUS - LOCAL-AGENT-ID: {} \n", agentId, ex);
        }
    }

    private void removeEmitter(String agentId) {

        SseEmitter emitter = emitters.remove(agentId);

        if (emitter != null) {
            try {
                emitter.complete();
            } catch (Exception ignored) {
            }
        }
    }

}