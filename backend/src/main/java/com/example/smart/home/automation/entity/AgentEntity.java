package com.example.smart.home.automation.entity;

import com.example.smart.home.automation.enums.ConnectionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.List;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "agents", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "local_agent_id"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    @Column(name = "agent_id", unique = true, nullable = false)
    private String agentId;

    @Column(name = "local_agent_id", unique = true, nullable = false)
    private String localAgentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    @Column(name = "agent_name", length = 100)
    private String agentName;

    @Column(name = "pairing_code", unique = true, length = 10)
    private String pairingCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "connection_status", nullable = false)
    private ConnectionStatus connectionStatus;

    @CreatedDate
    @Column(name = "linked_at", updatable = false)
    private Instant linkedAt;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "agentEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BindingEntity> bindingEntityList;

    @OneToMany(mappedBy = "agentEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoomEntity> roomEntityList;

}