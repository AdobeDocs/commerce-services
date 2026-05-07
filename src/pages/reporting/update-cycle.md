---
title: Update Cycle Status | Commerce Services
description: Retrieve the most recent update-cycle result for a Commerce Intelligence client, including job type, status, and timestamps.
keywords:
  - Reporting
  - REST
  - Services
---

# Update Cycle Status API

Use the **Update Cycle Status API** to retrieve the most recent completed update-cycle result (for example, a **Full Update**) for a specific Commerce Intelligence client. The response returns job metadata (type, status, start and end times) and the client's time zone abbreviation.

<InlineAlert variant="info" slots="text" />

See the [Export API](export-api.md) for exporting data; both APIs use the same authentication header.

## Base URL

`https://api.rjmetrics.com/0.1`

## Endpoint

`GET /client/:clientId/fullupdatestatus`

### Path parameters

| Name | Type | Required | Description |
|---|---|---:|---|
| `clientId` | integer | Yes | Your Commerce Intelligence client identifier. |

### Authentication

Before using this API, make sure you have generated an [Export API key](index.md#generating-authentication-token-for-the-export-api).

### Request headers

| Header | Value | Description |
|---|---|---|
| `X-RJM-API-Key` | `<your_key>` | Your Export API key |
| `Accept` | `application/json` | Response format |

### Sample request

```bash
curl -H "X-RJM-API-Key: $EXPORT_API_KEY" \
  -H "Accept: application/json" \
  https://api.rjmetrics.com/0.1/client/194/fullupdatestatus
```

### Response

**Status:** `200 OK`

```json
{
  "clientId": 194,
  "lastCompletedUpdateJob": {
    "id": 13554,
    "type": { "id": 2, "name": "Full Update" },
    "start": "2025-12-09 03:26:25",
    "end": "2025-12-09 03:29:03",
    "status": { "id": 4, "name": "Completed Successfully" }
  },
  "lastCompletedUpdateJobWithDataSync": null,
  "timezoneAbbreviation": "EST"
}
```

## Response fields

| Field | Type | Description |
|---|---|---|
| `clientId` | integer | Commerce Intelligence client identifier. |
| `lastCompletedUpdateJob` | object \| null | The most recent completed Full Update job. |
| `lastCompletedUpdateJob.id` | integer | Update job ID. |
| `lastCompletedUpdateJob.type.id` | integer | Update job type identifier (for example, `2`). |
| `lastCompletedUpdateJob.type.name` | string | Update job type name (for example, `Full Update`). |
| `lastCompletedUpdateJob.start` | string | Job start time in the client time zone (format: `YYYY-MM-DD HH:mm:ss`). |
| `lastCompletedUpdateJob.end` | string | Job end time in the client time zone (format: `YYYY-MM-DD HH:mm:ss`). |
| `lastCompletedUpdateJob.status.id` | integer | Terminal status identifier (for example, `4`). |
| `lastCompletedUpdateJob.status.name` | string | Terminal status name (for example, `Completed Successfully`). |
| `lastCompletedUpdateJobWithDataSync` | object \| null | Reserved for "Full Update + Data Sync" jobs; may be null if not applicable. |
| `timezoneAbbreviation` | string | Client time zone abbreviation (for example, `EST`). |

<InlineAlert variant="info" slots="text" />

Timestamps reflect the client's instance time zone; convert to UTC in downstream systems if required.

## Error responses

| HTTP | When |
|---|---|
| 403 | Malformed path or headers |
| 403 | Missing/invalid API key |
| 403 | Key lacks access to the client |
| 403 | Unknown clientId |
| 429 | Rate limit exceeded |
| 5xx | Service error |

## Best practices

Apply the following best practices to optimize your use of **Update Cycle Status API**.

### Polling frequency

Use this endpoint sparingly (for example, health checks or dashboard tiles). Adobe recommends at least 60 seconds between calls per `clientId` unless your contract specifies higher allowances.

### Understanding the response

- The endpoint returns the most recent **completed** update job. It does not stream in-flight progress.
- If an update is currently running, you will receive data from the previous completed update.
- The `lastCompletedUpdateJobWithDataSync` field is reserved for future use and may be `null`.

### API versioning

The base path `/0.1` matches the Export API version. Backwards-compatible fields may be added without notice; breaking changes will be versioned with a new path.
