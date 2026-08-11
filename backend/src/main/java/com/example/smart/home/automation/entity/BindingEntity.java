package com.example.smart.home.automation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "bindings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BindingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private AgentEntity agentEntity;

    @Column(unique = true, nullable = false)
    private String uid;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private String version;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private boolean verifiedAuthor;

    @Column(nullable = false)
    private boolean installed;

    @Column(nullable = false)
    private boolean compatible;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

}