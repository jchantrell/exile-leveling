import classNames from "classnames";
import { Fragment, RouteLookup } from "../../../../common/routes";
import { Area, Quest } from "../../../../common/types";
import {
  BsArrowDownSquare,
  BsArrowDownLeftSquare,
  BsArrowDownRightSquare,
  BsArrowLeftSquare,
  BsArrowRightSquare,
  BsArrowUpSquare,
  BsArrowUpLeftSquare,
  BsArrowUpRightSquare,
} from "react-icons/bs";
import { InlineFakeBlock } from "../InlineFakeBlock";
import { quests, areas } from "../../../../common/data";

import styles from "./ExileFragment.module.css";
import { SplitRow } from "../SplitRow";

interface FragmentProps {
  fragment: Fragment;
  lookup: RouteLookup;
}

function getImageUrl(path: string) {
  return new URL(`./images/${path}`, import.meta.url).href;
}

function EnemyComponent(enemy: string) {
  return <span className={classNames(styles.enemy)}>{enemy}</span>;
}

function AreaComponent(area?: Area, fallback?: string) {
  return (
    <div className={classNames(styles.noWrap)}>
      <span className={classNames(styles.area)}>{area?.name || fallback}</span>
      {area?.is_town_area && (
        <InlineFakeBlock child={<img src={getImageUrl("town.png")} alt="" />} />
      )}
    </div>
  );
}

function QuestComponent(quest: Quest) {
  return (
    <div className={classNames(styles.noWrap)}>
      <img
        src={getImageUrl("quest.png")}
        className={classNames("inlineIcon")}
        alt=""
      />
      <span className={classNames(styles.quest)}>{quest.name}</span>
    </div>
  );
}

function QuestTextComponent(text: string) {
  return <span className={classNames(styles.questText)}>{text}</span>;
}

function WaypointComponent() {
  return (
    <div className={classNames(styles.noWrap)}>
      <img
        src={getImageUrl("waypoint.png")}
        className={classNames("inlineIcon")}
        alt=""
      />
      <span className={classNames(styles.waypoint)}>Waypoint</span>
    </div>
  );
}

function TrialComponent() {
  return (
    <div className={classNames(styles.noWrap)}>
      <img
        src={getImageUrl("trial.png")}
        className={classNames("inlineIcon")}
        alt=""
      />
      <span className={classNames(styles.trial)}>Trial of Ascendancy</span>
    </div>
  );
}

function LogoutComponent(area: Area) {
  return (
    <>
      <span className={classNames(styles.default)}>Logout</span>
      <span> ➞ </span>
      {AreaComponent(area)}
    </>
  );
}

function PortalComponent(area?: Area) {
  return (
    <div className={classNames(styles.noWrap)}>
      <img
        src={getImageUrl("portal.png")}
        className={classNames("inlineIcon")}
        alt=""
      />
      <span className={classNames(styles.portal)}>Portal</span>
      {area && (
        <>
          <span> ➞ </span>
          {AreaComponent(area)}
        </>
      )}
    </div>
  );
}

const directions = [
  <InlineFakeBlock child={<BsArrowUpSquare />} />,
  <InlineFakeBlock child={<BsArrowUpRightSquare />} />,
  <InlineFakeBlock child={<BsArrowRightSquare />} />,
  <InlineFakeBlock child={<BsArrowDownRightSquare />} />,
  <InlineFakeBlock child={<BsArrowDownSquare />} />,
  <InlineFakeBlock child={<BsArrowDownLeftSquare />} />,
  <InlineFakeBlock child={<BsArrowLeftSquare />} />,
  <InlineFakeBlock child={<BsArrowUpLeftSquare />} />,
];

function DirectionComponent(dirIndex: number) {
  return <span>{directions[dirIndex]}</span>;
}

function GenericComponent(text: string) {
  return <span className={classNames(styles.default)}>{text}</span>;
}

function CraftingComponent(craftingRecipes: string[]) {
  return (
    <span>
      <div className={classNames(styles.noWrap)}>
        <img
          src={getImageUrl("crafting.png")}
          className={classNames("inlineIcon")}
          alt=""
        />
        <span className={classNames(styles.default)}>Crafting: </span>
      </div>
      <span className={classNames(styles.default)}>
        {craftingRecipes.join(", ")}
      </span>
    </span>
  );
}

function AscendComponent(guideUrl: string) {
  return (
    <SplitRow
      left={
        <div className={classNames(styles.noWrap)}>
          <img
            src={getImageUrl("trial.png")}
            className={classNames("inlineIcon")}
            alt=""
          />
          <span className={classNames(styles.trial)}>Ascend</span>
        </div>
      }
      right={
        <a
          href={guideUrl}
          target="_blank"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Daily Layout
        </a>
      }
    />
  );
}

export function ExileFragment({ fragment, lookup }: FragmentProps) {
  switch (fragment.type) {
    case "kill":
      return EnemyComponent(fragment.value);
    case "arena":
      return AreaComponent(undefined, fragment.value);
    case "area":
      return AreaComponent(areas[fragment.areaId]);
    case "enter":
      return AreaComponent(areas[fragment.areaId]);
    case "quest": {
      return QuestComponent(quests[fragment.questId]);
    }
    case "quest_text":
      return QuestTextComponent(fragment.value);
    case "waypoint": {
      if (fragment.areaId == null) return WaypointComponent();

      return (
        <>
          {WaypointComponent()}
          <span> ➞ </span>
          {AreaComponent(areas[fragment.areaId])}
        </>
      );
    }
    case "get_waypoint":
      return WaypointComponent();
    case "trial":
      return TrialComponent();
    case "logout":
      return LogoutComponent(areas[fragment.areaId]);
    case "portal":
      return PortalComponent(
        fragment.targetAreaId ? areas[fragment.targetAreaId] : undefined
      );
    case "dir":
      return DirectionComponent(fragment.dirIndex);
    case "generic":
      return GenericComponent(fragment.value);
    case "crafting":
      return CraftingComponent(fragment.crafting_recipes);
    case "ascend":
      return AscendComponent(fragment.guideUrl);
  }

  return <>{`unmapped: ${JSON.stringify(fragment)}`}</>;
}
